<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ApplicationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationScreeningSaveRequest;
use App\Models\Application;
use App\Models\Vacancy;
use App\Services\ActivityLogger;
use App\Services\RecruitmentWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        $applications = Application::query()
            ->with(['applicant:id,name,email', 'vacancy:id,title,reference_number', 'screenings' => fn ($query) => $query->latest('screened_at')->limit(1)])
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->value()))
            ->when($request->filled('vacancy_id'), fn ($query) => $query->where('vacancy_id', $request->integer('vacancy_id')))
            ->when($request->filled('search'), function ($query) use ($request): void {
                $term = '%'.mb_strtolower($request->string('search')->value()).'%';
                $query->where(fn ($builder) => $builder
                    ->whereRaw('LOWER(application_number) LIKE ?', [$term])
                    ->orWhereHas('applicant', fn ($applicant) => $applicant
                        ->whereRaw('LOWER(name) LIKE ?', [$term])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$term])));
            })
            ->latest('submitted_at')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/applications/index', [
            'applications' => $applications,
            'vacancies' => Vacancy::query()->orderBy('title')->get(['id', 'title']),
            'statuses' => array_column(ApplicationStatus::cases(), 'value'),
            'filters' => $request->only(['search', 'status', 'vacancy_id']),
        ]);
    }

    public function show(Application $application): Response
    {
        $this->authorize('view', $application);
        $application->load([
            'applicant.applicantProfile.qualifications',
            'applicant.applicantProfile.workExperiences',
            'vacancy.department',
            'documents:id,application_id,document_type,document_name,file_size',
            'screenings.screener:id,name',
            'interviews.panelMembers:id,name,email',
            'interviews.evaluations.evaluator:id,name',
            'recruitmentDecision.decisionMaker:id,name',
        ]);

        return Inertia::render('admin/applications/show', ['application' => $application]);
    }

    public function screen(
        ApplicationScreeningSaveRequest $request,
        Application $application,
        RecruitmentWorkflowService $workflow,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        $this->authorize('screen', $application);
        $screening = $workflow->screen($application, $request->user(), $request->validated());
        $activityLogger->record($request->user(), 'application.screened', "Screened application {$application->application_number}.", $screening, $request);

        return back()->with('success', 'Screening result recorded.');
    }

    public function shortlist(
        Request $request,
        Application $application,
        RecruitmentWorkflowService $workflow,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        $this->authorize('shortlist', $application);
        $workflow->shortlist($application);
        $activityLogger->record($request->user(), 'application.shortlisted', "Shortlisted application {$application->application_number}.", $application, $request);

        return back()->with('success', 'Applicant shortlisted.');
    }
}
