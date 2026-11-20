<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\InterviewStatus;
use App\Http\Requests\InterviewRescheduleRequest;
use App\Http\Requests\InterviewSaveRequest;
use App\Models\Application;
use App\Models\Interview;
use App\Models\User;
use App\Notifications\RecruitmentUpdateNotification;
use App\Services\ActivityLogger;
use App\Services\RecruitmentWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Interview::query()->with([
            'application.applicant:id,name,email',
            'application.vacancy:id,title,reference_number',
            'panelMembers:id,name,email',
        ]);

        if (! $request->user()->can('manage interview panels')) {
            $query->whereHas('panelMembers', fn ($members) => $members->whereKey($request->user()->id));
        }

        return Inertia::render('interviewer/interviews/index', [
            'interviews' => $query->orderByDesc('interview_date')->paginate(15)->withQueryString(),
            'canSchedule' => $request->user()->can('schedule interviews'),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_unless($request->user()?->can('schedule interviews'), 403);

        return Inertia::render('admin/interviews/form', [
            'applications' => Application::query()->with(['applicant:id,name', 'vacancy:id,title'])
                ->where('status', ApplicationStatus::SHORTLISTED)->orderBy('submitted_at')->get(),
            'panelMembers' => User::role('INTERVIEWER')->where('is_active', true)->orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function store(
        InterviewSaveRequest $request,
        RecruitmentWorkflowService $workflow,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        $data = $request->validated();
        $panelMemberIds = $data['panel_member_ids'];
        unset($data['panel_member_ids']);

        $interview = $workflow->scheduleInterview(
            Application::findOrFail($data['application_id']),
            $data,
            $panelMemberIds,
        );
        $activityLogger->record($request->user(), 'interview.scheduled', "Scheduled interview {$interview->id}.", $interview, $request);

        return to_route('interviews.index')->with('success', 'Interview scheduled and panel assigned.');
    }

    public function show(Request $request, Interview $interview): Response
    {
        $this->authorize('view', $interview);
        $interview->load([
            'application.applicant.applicantProfile.qualifications',
            'application.vacancy.department',
            'panelMembers:id,name,email',
            'evaluations.evaluator:id,name',
        ]);

        return Inertia::render('interviewer/interviews/show', [
            'interview' => $interview,
            'evaluation' => $interview->evaluations()->where('evaluator_id', $request->user()->id)->first(),
            'canEvaluate' => $request->user()->can('evaluate', $interview),
            'canManage' => $request->user()->can('manage interview panels'),
            'availablePanelMembers' => $request->user()->can('manage interview panels')
                ? User::role('INTERVIEWER')->where('is_active', true)->orderBy('name')->get(['id', 'name', 'email'])
                : [],
        ]);
    }

    public function reschedule(
        InterviewRescheduleRequest $request,
        Interview $interview,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        abort_unless(in_array($interview->status, [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED], true), 422, 'Only scheduled interviews can be rescheduled.');
        $interview->update([...$request->validated(), 'status' => InterviewStatus::RESCHEDULED]);
        $interview->application->applicant->notify(new RecruitmentUpdateNotification(
            'Interview rescheduled',
            'Your interview for '.$interview->application->vacancy->title.' has been rescheduled to '.$interview->interview_date->format('M j, Y g:i A').'.',
            '/applications/'.$interview->application_id,
        ));
        $activityLogger->record($request->user(), 'interview.rescheduled', "Rescheduled interview {$interview->id}.", $interview, $request);

        return back()->with('success', 'Interview rescheduled.');
    }

    public function updatePanel(Request $request, Interview $interview, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('manage interview panels'), 403);
        abort_unless(in_array($interview->status, [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED], true), 422, 'The panel can only be changed for an active scheduled interview.');
        abort_if($interview->evaluations()->exists(), 422, 'The panel cannot be changed after an evaluation has been submitted.');
        $data = $request->validate([
            'panel_member_ids' => ['required', 'array', 'min:1', 'max:20'],
            'panel_member_ids.*' => ['required', 'integer', 'distinct', 'exists:users,id'],
        ]);
        $panel = User::role('INTERVIEWER')->whereIn('id', $data['panel_member_ids'])->pluck('id')->all();
        if (count($panel) !== count($data['panel_member_ids'])) {
            throw ValidationException::withMessages(['panel_member_ids' => 'Every panel member must have the INTERVIEWER role.']);
        }

        DB::transaction(fn () => $interview->panelMembers()->sync($panel));
        $activityLogger->record($request->user(), 'interview.panel_updated', "Updated panel for interview {$interview->id}.", $interview, $request);

        return back()->with('success', 'Interview panel updated.');
    }

    public function cancel(Request $request, Interview $interview, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('manage interview panels'), 403);
        abort_unless(in_array($interview->status, [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED], true), 422, 'This interview can no longer be cancelled.');

        DB::transaction(function () use ($interview): void {
            $interview->update(['status' => InterviewStatus::CANCELLED]);
            $application = $interview->application;
            if ($application->status === ApplicationStatus::INTERVIEW_SCHEDULED
                && ! $application->interviews()->where('id', '<>', $interview->id)->whereIn('status', ['SCHEDULED', 'RESCHEDULED'])->exists()) {
                $application->update(['status' => ApplicationStatus::SHORTLISTED]);
            }
        });
        $interview->application->applicant->notify(new RecruitmentUpdateNotification(
            'Interview cancelled',
            'The interview for your application to '.$interview->application->vacancy->title.' has been cancelled. HR may contact you if it is rescheduled.',
            '/applications/'.$interview->application_id,
        ));
        $activityLogger->record($request->user(), 'interview.cancelled', "Cancelled interview {$interview->id}.", $interview, $request);

        return back()->with('success', 'Interview cancelled.');
    }
}
