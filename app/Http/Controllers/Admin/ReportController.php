<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()?->can('view reports'), 403);
        [$from, $to] = $this->dateRange($request);

        $applications = Application::query()
            ->when($from, fn ($query) => $query->where('submitted_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('submitted_at', '<=', $to));

        return Inertia::render('admin/reports/index', [
            'summary' => [
                'total' => (clone $applications)->count(),
                'selected' => (clone $applications)->where('status', 'SELECTED')->count(),
                'rejected' => (clone $applications)->where('status', 'REJECTED')->count(),
                'reserved' => (clone $applications)->where('status', 'RESERVED')->count(),
            ],
            'byStatus' => (clone $applications)->selectRaw('status, COUNT(*) as total')->groupBy('status')->orderBy('status')->get(),
            'byVacancy' => (clone $applications)->selectRaw('vacancy_id, COUNT(*) as total')
                ->with('vacancy:id,title,reference_number')->groupBy('vacancy_id')->orderByDesc('total')->limit(12)->get(),
            'filters' => $request->only(['from', 'to']),
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        abort_unless($request->user()?->can('view reports'), 403);
        [$from, $to] = $this->dateRange($request);

        return response()->streamDownload(function () use ($from, $to): void {
            $stream = fopen('php://output', 'w');
            fputcsv($stream, ['Application Number', 'Applicant', 'Email', 'Vacancy', 'Reference', 'Status', 'Submitted At']);

            Application::query()->with(['applicant:id,name,email', 'vacancy:id,title,reference_number'])
                ->when($from, fn ($query) => $query->where('submitted_at', '>=', $from))
                ->when($to, fn ($query) => $query->where('submitted_at', '<=', $to))
                ->chunkById(500, function ($applications) use ($stream): void {
                    foreach ($applications as $application) {
                        fputcsv($stream, [
                            $application->application_number,
                            $application->applicant->name,
                            $application->applicant->email,
                            $application->vacancy->title,
                            $application->vacancy->reference_number,
                            $application->status->value,
                            $application->submitted_at->toIso8601String(),
                        ]);
                    }
                });

            fclose($stream);
        }, 'recruitment-report.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /** @return array{?Carbon, ?Carbon} */
    private function dateRange(Request $request): array
    {
        $filters = $request->validate([
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
        ]);

        return [
            isset($filters['from']) ? Carbon::parse($filters['from'])->startOfDay() : null,
            isset($filters['to']) ? Carbon::parse($filters['to'])->endOfDay() : null,
        ];
    }
}
