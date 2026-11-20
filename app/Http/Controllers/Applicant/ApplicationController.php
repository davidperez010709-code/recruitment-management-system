<?php

namespace App\Http\Controllers\Applicant;

use App\Enums\VacancyStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationSubmissionRequest;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\Vacancy;
use App\Notifications\RecruitmentUpdateNotification;
use App\Services\ActivityLogger;
use App\Services\ProfileCompletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ApplicationController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('applicant/applications/index', [
            'applications' => $request->user()->applications()
                ->with(['vacancy.department', 'screenings' => fn ($query) => $query->latest('screened_at'), 'interviews' => fn ($query) => $query->orderByDesc('interview_date')])
                ->latest('submitted_at')
                ->paginate(12)
                ->withQueryString(),
        ]);
    }

    public function show(Request $request, Application $application): Response
    {
        $this->authorize('view', $application);
        $application->load(['vacancy.department', 'documents:id,application_id,document_type,document_name,file_size', 'interviews:id,application_id,interview_type,interview_date,location,instructions,status']);

        return Inertia::render('applicant/applications/show', ['application' => $application]);
    }

    public function store(
        ApplicationSubmissionRequest $request,
        Vacancy $vacancy,
        ProfileCompletionService $completion,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        $user = $request->user();
        abort_unless($vacancy->status === VacancyStatus::PUBLISHED && ! $vacancy->application_deadline->lt(today()), 404);

        if (! $completion->isReadyToApply($user)) {
            throw ValidationException::withMessages(['profile' => 'Complete your date of birth, address, state of origin, and at least one qualification before applying.']);
        }
        if ($user->applications()->where('vacancy_id', $vacancy->id)->exists()) {
            throw ValidationException::withMessages(['application' => 'You have already applied for this vacancy.']);
        }

        $data = $request->validated();
        $documents = $data['documents'] ?? [];
        unset($data['documents']);
        $storedPaths = [];

        try {
            // SQL rollback cannot remove stored files, so track paths for cleanup on failure.
            $application = DB::transaction(function () use ($data, $documents, $vacancy, $user, &$storedPaths): Application {
                $application = Application::create([
                    'vacancy_id' => $vacancy->id,
                    'applicant_user_id' => $user->id,
                    'application_number' => $this->applicationNumber(),
                    'cover_letter' => $data['cover_letter'] ?? null,
                    'status' => 'SUBMITTED',
                    'submitted_at' => now(),
                ]);

                foreach ($documents as $document) {
                    $file = $document['file'];
                    $path = $file->store("application-documents/{$application->id}", 'local');
                    $storedPaths[] = $path;

                    $application->documents()->create([
                        'document_type' => $document['type'],
                        'document_name' => $this->safeDocumentName($file->getClientOriginalName()),
                        'file_path' => $path,
                        'mime_type' => $file->getMimeType() ?: 'application/octet-stream',
                        'file_size' => $file->getSize(),
                    ]);
                }

                return $application;
            });
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($storedPaths);
            throw $exception;
        }

        $user->notify(new RecruitmentUpdateNotification(
            'Application submitted',
            'Your application for '.$vacancy->title.' has been submitted.',
            '/applications/'.$application->id,
        ));
        $activityLogger->record($user, 'application.submitted', "Submitted application {$application->application_number}.", $application, $request);

        return to_route('applicant.applications.show', $application)->with('success', 'Application submitted.');
    }

    public function downloadDocument(Request $request, ApplicationDocument $document): StreamedResponse
    {
        $document->load('application');
        // Authorize the parent application before reading from the private disk.
        $this->authorize('view', $document->application);

        return Storage::disk('local')->download($document->file_path, $document->document_name);
    }

    private function applicationNumber(): string
    {
        do {
            $number = 'APP-'.now()->format('Y').'-'.Str::upper(Str::random(8));
        } while (Application::where('application_number', $number)->exists());

        return $number;
    }

    private function safeDocumentName(string $name): string
    {
        $name = basename(str_replace('\\', '/', $name));
        $name = preg_replace('/[\x00-\x1F\x7F]/u', '', $name) ?: 'document';

        return mb_substr($name, 0, 255);
    }
}
