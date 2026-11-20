<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationStatus;
use App\Enums\InterviewStatus;
use App\Enums\VacancyStatus;
use App\Models\Application;
use App\Models\Interview;
use App\Models\User;
use App\Models\Vacancy;
use App\Services\ProfileCompletionService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, ProfileCompletionService $completion): Response
    {
        $user = $request->user();

        if ($user->hasAnyRole(['SUPER_ADMIN', 'HR_ADMIN', 'HR_OFFICER'])) {
            return $this->adminDashboard();
        }

        if ($user->hasRole('INTERVIEWER')) {
            return $this->interviewerDashboard($user);
        }

        return $this->applicantDashboard($user, $completion);
    }

    private function adminDashboard(): Response
    {
        $pending = [ApplicationStatus::SUBMITTED->value, ApplicationStatus::UNDER_REVIEW->value];
        $upcomingStatus = [InterviewStatus::SCHEDULED->value, InterviewStatus::RESCHEDULED->value];

        $stats = [
            'totalApplicants' => User::role('APPLICANT')->count(),
            'activeVacancies' => Vacancy::where('status', VacancyStatus::PUBLISHED)->whereDate('application_deadline', '>=', today())->count(),
            'totalApplications' => Application::count(),
            'pendingReview' => Application::whereIn('status', $pending)->count(),
            'shortlisted' => Application::where('status', ApplicationStatus::SHORTLISTED)->count(),
            'scheduledInterviews' => Interview::whereIn('status', $upcomingStatus)->where('interview_date', '>=', now())->count(),
            'successfulCandidates' => Application::where('status', ApplicationStatus::SELECTED)->count(),
        ];

        $monthlyActivity = collect(range(5, 0))->map(function (int $monthsAgo): array {
            $start = CarbonImmutable::now()->startOfMonth()->subMonths($monthsAgo);
            $end = $start->endOfMonth();

            return [
                'month' => $start->format('M Y'),
                'applications' => Application::whereBetween('submitted_at', [$start, $end])->count(),
            ];
        })->values();

        $statusDistribution = DB::table('applications')
            ->select('status', DB::raw('COUNT(*) as total'))
            ->groupBy('status')
            ->orderBy('status')
            ->get();

        return Inertia::render('dashboard', [
            'audience' => 'admin',
            'stats' => $stats,
            'monthlyActivity' => $monthlyActivity,
            'statusDistribution' => $statusDistribution,
            'applicationsByVacancy' => Vacancy::withCount('applications')->orderByDesc('applications_count')->limit(6)->get(['id', 'title']),
            'recentApplications' => Application::with(['applicant:id,name', 'vacancy:id,title'])
                ->latest('submitted_at')->limit(8)->get(),
            'upcomingInterviews' => Interview::with(['application.applicant:id,name', 'application.vacancy:id,title'])
                ->whereIn('status', $upcomingStatus)->where('interview_date', '>=', now())
                ->orderBy('interview_date')->limit(8)->get(),
        ]);
    }

    private function applicantDashboard(User $user, ProfileCompletionService $completion): Response
    {
        $applications = $user->applications();

        return Inertia::render('dashboard', [
            'audience' => 'applicant',
            'stats' => [
                'profileCompletion' => $completion->percentage($user),
                'availableVacancies' => Vacancy::where('status', VacancyStatus::PUBLISHED)->whereDate('application_deadline', '>=', today())->count(),
                'applicationsSubmitted' => (clone $applications)->count(),
                'underReview' => (clone $applications)->whereIn('status', [ApplicationStatus::SUBMITTED, ApplicationStatus::UNDER_REVIEW])->count(),
                'shortlisted' => (clone $applications)->where('status', ApplicationStatus::SHORTLISTED)->count(),
                'upcomingInterviews' => Interview::whereHas('application', fn ($query) => $query->where('applicant_user_id', $user->id))
                    ->whereIn('status', [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED])->where('interview_date', '>=', now())->count(),
            ],
            'recentApplications' => $user->applications()->with('vacancy:id,title,reference_number')->latest('submitted_at')->limit(6)->get(),
            'upcomingInterviews' => Interview::whereHas('application', fn ($query) => $query->where('applicant_user_id', $user->id))
                ->with(['application.applicant:id,name', 'application.vacancy:id,title'])
                ->whereIn('status', [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED])->where('interview_date', '>=', now())
                ->orderBy('interview_date')->limit(5)->get(),
            'notifications' => $user->notifications()->latest()->limit(6)->get(['id', 'type', 'data', 'read_at', 'created_at']),
        ]);
    }

    private function interviewerDashboard(User $user): Response
    {
        $assigned = Interview::whereHas('panelMembers', fn ($query) => $query->whereKey($user->id));

        return Inertia::render('dashboard', [
            'audience' => 'interviewer',
            'stats' => [
                'assignedInterviews' => (clone $assigned)->count(),
                'upcomingInterviews' => (clone $assigned)->whereIn('status', [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED])->where('interview_date', '>=', now())->count(),
                'completedInterviews' => (clone $assigned)->where('status', InterviewStatus::COMPLETED)->count(),
                'pendingEvaluations' => (clone $assigned)->whereIn('status', [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED])
                    ->whereDoesntHave('evaluations', fn ($query) => $query->where('evaluator_id', $user->id))->count(),
            ],
            'upcomingInterviews' => (clone $assigned)->with(['application.applicant:id,name', 'application.vacancy:id,title'])
                ->whereIn('status', [InterviewStatus::SCHEDULED, InterviewStatus::RESCHEDULED])->where('interview_date', '>=', now())
                ->orderBy('interview_date')->limit(8)->get(),
            'evaluationHistory' => $user->interviewEvaluations()->with('interview.application.vacancy:id,title')->latest()->limit(8)->get(),
        ]);
    }
}
