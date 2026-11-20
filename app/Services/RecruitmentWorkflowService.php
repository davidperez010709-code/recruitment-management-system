<?php

namespace App\Services;

use App\Enums\ApplicationStatus;
use App\Enums\InterviewStatus;
use App\Enums\RecruitmentDecisionType;
use App\Enums\ScreeningResult;
use App\Enums\VacancyStatus;
use App\Models\Application;
use App\Models\ApplicationScreening;
use App\Models\Interview;
use App\Models\InterviewEvaluation;
use App\Models\RecruitmentDecision;
use App\Models\User;
use App\Models\Vacancy;
use App\Notifications\RecruitmentUpdateNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Centralizes legal recruitment state changes and their transaction boundaries.
 */
class RecruitmentWorkflowService
{
    /** Publish only an editable draft with a deadline that has not passed. */
    public function publishVacancy(Vacancy $vacancy): Vacancy
    {
        if ($vacancy->status !== VacancyStatus::DRAFT) {
            throw ValidationException::withMessages(['status' => 'Only draft vacancies can be published.']);
        }

        if ($vacancy->application_deadline->lt(today())) {
            throw ValidationException::withMessages(['application_deadline' => 'The application deadline must be in the future.']);
        }

        $vacancy->update(['status' => VacancyStatus::PUBLISHED, 'published_at' => now()]);

        return $vacancy->refresh();
    }

    public function screen(Application $application, User $actor, array $data): ApplicationScreening
    {
        if (! in_array($application->status, [ApplicationStatus::SUBMITTED, ApplicationStatus::UNDER_REVIEW], true)) {
            throw ValidationException::withMessages(['application' => 'This application is no longer available for screening.']);
        }

        // Keep the screening history and first review-state transition atomic.
        return DB::transaction(function () use ($application, $actor, $data): ApplicationScreening {
            $screening = $application->screenings()->create([
                ...$data,
                'screened_by' => $actor->id,
                'screened_at' => now(),
            ]);

            if ($application->status === ApplicationStatus::SUBMITTED) {
                $application->update(['status' => ApplicationStatus::UNDER_REVIEW]);
            }

            $application->applicant->notify(new RecruitmentUpdateNotification(
                'Application screening updated',
                'A screening result for your application to '.$application->vacancy->title.' has been recorded: '.$screening->result->value.'.',
                '/applications/'.$application->id,
            ));

            return $screening;
        });
    }

    public function shortlist(Application $application): Application
    {
        // Lock the row so concurrent HR actions cannot use a stale application state.
        return DB::transaction(function () use ($application): Application {
            $application = Application::query()->lockForUpdate()->findOrFail($application->id);
            $latestScreening = $application->screenings()->latest('id')->first();

            if ($application->status !== ApplicationStatus::UNDER_REVIEW
                || $latestScreening?->result !== ScreeningResult::QUALIFIED) {
                throw ValidationException::withMessages(['application' => 'Only qualified applications under review can be shortlisted.']);
            }

            $application->update(['status' => ApplicationStatus::SHORTLISTED]);
            $application->applicant->notify(new RecruitmentUpdateNotification(
                'You have been shortlisted',
                'Your application for '.$application->vacancy->title.' has been shortlisted.',
                '/applications/'.$application->id,
            ));

            return $application->refresh();
        });
    }

    /** @param list<int> $panelMemberIds */
    public function scheduleInterview(Application $application, array $data, array $panelMemberIds): Interview
    {
        // Interview, panel assignment, and application status form one workflow step.
        return DB::transaction(function () use ($application, $data, $panelMemberIds): Interview {
            $application = Application::query()->lockForUpdate()->with('applicant')->findOrFail($application->id);

            if ($application->status !== ApplicationStatus::SHORTLISTED) {
                throw ValidationException::withMessages(['application_id' => 'Only shortlisted applications can be scheduled for interview.']);
            }

            $panelMembers = User::query()->whereKey($panelMemberIds)->get();
            if ($panelMembers->count() !== count(array_unique($panelMemberIds)) || $panelMembers->contains(fn (User $user) => ! $user->hasRole('INTERVIEWER'))) {
                throw ValidationException::withMessages(['panel_member_ids' => 'Every panel member must have the INTERVIEWER role.']);
            }

            $interview = $application->interviews()->create([
                'interview_type' => $data['interview_type'],
                'interview_date' => $data['interview_date'],
                'location' => $data['location'] ?? null,
                'instructions' => $data['instructions'] ?? null,
                'status' => InterviewStatus::SCHEDULED,
            ]);
            $interview->panelMembers()->sync($panelMemberIds);
            $application->update(['status' => ApplicationStatus::INTERVIEW_SCHEDULED]);
            $application->applicant->notify(new RecruitmentUpdateNotification(
                'Interview scheduled',
                'An interview for '.$application->vacancy->title.' is scheduled for '.$interview->interview_date->format('M j, Y g:i A').'.',
                '/applications/'.$application->id,
            ));

            return $interview->load('panelMembers');
        });
    }

    public function evaluate(Interview $interview, User $evaluator, array $data): InterviewEvaluation
    {
        // Repeat the route policy's assignment check so direct service callers cannot bypass it.
        return DB::transaction(function () use ($interview, $evaluator, $data): InterviewEvaluation {
            $interview = Interview::query()->lockForUpdate()->with('panelMembers')->findOrFail($interview->id);
            if (! in_array($interview->status, [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED], true)) {
                throw ValidationException::withMessages(['interview' => 'Evaluations can only be submitted for scheduled interviews.']);
            }
            if (! $interview->panelMembers->contains('id', $evaluator->id)) {
                throw ValidationException::withMessages(['interview' => 'Only assigned panel members can submit evaluations.']);
            }

            $scores = [
                (float) $data['technical_score'],
                (float) $data['communication_score'],
                (float) $data['experience_score'],
            ];
            $evaluation = $interview->evaluations()->create([
                ...$data,
                'evaluator_id' => $evaluator->id,
                'overall_score' => round(array_sum($scores) / count($scores), 2),
            ]);

            if ($interview->evaluations()->count() >= $interview->panelMembers->count()) {
                $interview->update(['status' => InterviewStatus::COMPLETED]);
                $interview->application->update(['status' => ApplicationStatus::INTERVIEW_COMPLETED]);
                $interview->application->applicant->notify(new RecruitmentUpdateNotification(
                    'Interview completed',
                    'Your interview for '.$interview->application->vacancy->title.' has been completed.',
                    '/applications/'.$interview->application_id,
                ));
            }

            return $evaluation;
        });
    }

    public function decide(Application $application, User $actor, RecruitmentDecisionType $decision, ?string $remarks): RecruitmentDecision
    {
        // A final decision is recorded only after the interview workflow is complete.
        return DB::transaction(function () use ($application, $actor, $decision, $remarks): RecruitmentDecision {
            $application = Application::query()->lockForUpdate()->with(['applicant', 'vacancy'])->findOrFail($application->id);

            if ($application->status !== ApplicationStatus::INTERVIEW_COMPLETED) {
                throw ValidationException::withMessages(['application' => 'A final decision requires a completed interview.']);
            }

            $record = $application->recruitmentDecision()->create([
                'decided_by' => $actor->id,
                'decision' => $decision,
                'remarks' => $remarks,
                'decision_date' => now(),
            ]);
            $application->update(['status' => ApplicationStatus::from($decision->value)]);
            $application->applicant->notify(new RecruitmentUpdateNotification(
                'Recruitment decision recorded',
                'A decision has been recorded for your application to '.$application->vacancy->title.'.',
                '/applications/'.$application->id,
            ));

            return $record;
        });
    }
}
