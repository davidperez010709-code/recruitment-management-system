<?php

namespace Database\Seeders;

use App\Enums\ApplicationStatus;
use App\Enums\InterviewStatus;
use App\Enums\RecruitmentDecisionType;
use App\Enums\ScreeningResult;
use App\Models\Application;
use App\Models\Interview;
use App\Models\InterviewEvaluation;
use App\Models\RecruitmentDecision;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $hrOfficer = User::where('email', 'hr.officer@example.com')->firstOrFail();
        $interviewer = User::where('email', 'interviewer@example.com')->firstOrFail();
        $records = [
            ['candidate.one@example.com', 'UIR-2026-ACA001', ApplicationStatus::SUBMITTED],
            ['candidate.two@example.com', 'UIR-2026-ADM001', ApplicationStatus::UNDER_REVIEW],
            ['candidate.three@example.com', 'UIR-2026-ACA001', ApplicationStatus::SHORTLISTED],
            ['candidate.four@example.com', 'UIR-2026-TEC001', ApplicationStatus::INTERVIEW_SCHEDULED],
            ['candidate.five@example.com', 'UIR-2026-NAC001', ApplicationStatus::INTERVIEW_COMPLETED],
            ['candidate.six@example.com', 'UIR-2026-ACA001', ApplicationStatus::SELECTED],
            ['candidate.seven@example.com', 'UIR-2026-ADM001', ApplicationStatus::REJECTED],
        ];

        foreach ($records as $index => [$email, $reference, $status]) {
            $applicant = User::where('email', $email)->firstOrFail();
            $vacancy = Vacancy::where('reference_number', $reference)->firstOrFail();
            $application = Application::updateOrCreate(
                ['application_number' => 'APP-2026-DEMO'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT)],
                [
                    'vacancy_id' => $vacancy->id,
                    'applicant_user_id' => $applicant->id,
                    'cover_letter' => 'I am pleased to apply for this role and believe my education and experience align with the stated requirements.',
                    'status' => $status,
                    'submitted_at' => now()->subDays(10 - $index),
                ],
            );

            if ($status !== ApplicationStatus::SUBMITTED) {
                $application->screenings()->updateOrCreate(
                    ['screened_by' => $hrOfficer->id],
                    ['screening_score' => 70 + $index, 'remarks' => 'Qualifications and submitted information reviewed.', 'result' => ScreeningResult::QUALIFIED, 'screened_at' => now()->subDays(8 - $index)],
                );
            }

            if (in_array($status, [ApplicationStatus::INTERVIEW_SCHEDULED, ApplicationStatus::INTERVIEW_COMPLETED, ApplicationStatus::SELECTED, ApplicationStatus::REJECTED], true)) {
                $completed = $status !== ApplicationStatus::INTERVIEW_SCHEDULED;
                $interview = Interview::updateOrCreate(
                    ['application_id' => $application->id],
                    [
                        'interview_type' => 'Panel interview',
                        'interview_date' => $completed ? now()->subDays(2) : now()->addDays(3),
                        'location' => 'Human Resources Conference Room',
                        'instructions' => 'Please arrive 15 minutes before the scheduled session.',
                        'status' => $completed ? InterviewStatus::COMPLETED : InterviewStatus::SCHEDULED,
                    ],
                );
                $interview->panelMembers()->syncWithoutDetaching([$interviewer->id]);

                if ($completed) {
                    InterviewEvaluation::updateOrCreate(
                        ['interview_id' => $interview->id, 'evaluator_id' => $interviewer->id],
                        ['technical_score' => 82, 'communication_score' => 78, 'experience_score' => 84, 'overall_score' => 81.33, 'comments' => 'Demonstrated relevant knowledge and clear communication.', 'recommendation' => 'RECOMMEND'],
                    );
                }
            }

            if (in_array($status, [ApplicationStatus::SELECTED, ApplicationStatus::REJECTED], true)) {
                RecruitmentDecision::updateOrCreate(
                    ['application_id' => $application->id],
                    [
                        'decided_by' => User::where('email', 'hr.admin@example.com')->value('id'),
                        'decision' => $status === ApplicationStatus::SELECTED ? RecruitmentDecisionType::SELECTED : RecruitmentDecisionType::REJECTED,
                        'remarks' => $status === ApplicationStatus::SELECTED ? 'Recommended for appointment.' : 'Assessment completed; another candidate was selected.',
                        'decision_date' => now()->subDay(),
                    ],
                );
            }
        }
    }
}
