<?php

namespace App\Http\Controllers\Applicant;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicantProfileSaveRequest;
use App\Http\Requests\QualificationSaveRequest;
use App\Http\Requests\WorkExperienceSaveRequest;
use App\Models\ApplicantProfile;
use App\Models\Qualification;
use App\Models\WorkExperience;
use App\Services\ActivityLogger;
use App\Services\ProfileCompletionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ProfileController extends Controller
{
    public function edit(Request $request, ProfileCompletionService $completion): Response
    {
        $profile = $this->profile($request)->load(['qualifications', 'workExperiences']);

        return Inertia::render('applicant/profile/edit', [
            'profile' => $profile,
            'phone' => $request->user()->phone,
            'completion' => $completion->percentage($request->user(), $profile),
        ]);
    }

    public function update(ApplicantProfileSaveRequest $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $profile = $this->profile($request);
        $data = $request->validated();
        $photo = $data['profile_photo'] ?? null;
        $phone = $data['phone'] ?? null;
        unset($data['profile_photo']);
        unset($data['phone']);
        $oldPhoto = $profile->profile_photo;
        $newPhoto = null;

        if ($photo) {
            // Keep the old photo until both SQL updates commit successfully.
            $newPhoto = $photo->store("applicant-profiles/{$profile->id}", 'local');
            if (! $newPhoto) {
                throw new \RuntimeException('The profile photo could not be stored.');
            }
            $data['profile_photo'] = $newPhoto;
        }

        try {
            DB::transaction(function () use ($profile, $data, $request, $phone): void {
                $profile->update($data);
                $request->user()->update(['phone' => $phone]);
            });
        } catch (\Throwable $exception) {
            if ($newPhoto) {
                Storage::disk('local')->delete($newPhoto);
            }

            throw $exception;
        }

        if ($newPhoto && $oldPhoto) {
            Storage::disk('local')->delete($oldPhoto);
        }
        $activityLogger->record($request->user(), 'profile.updated', 'Updated applicant profile.', $profile, $request);

        return back()->with('success', 'Profile saved.');
    }

    public function storeQualification(QualificationSaveRequest $request): RedirectResponse
    {
        $this->profile($request)->qualifications()->create($request->validated());

        return back()->with('success', 'Qualification added.');
    }

    public function updateQualification(QualificationSaveRequest $request, Qualification $qualification): RedirectResponse
    {
        abort_unless($qualification->applicant_profile_id === $this->profile($request)->id, 404);
        $qualification->update($request->validated());

        return back()->with('success', 'Qualification updated.');
    }

    public function destroyQualification(Request $request, Qualification $qualification): RedirectResponse
    {
        abort_unless($request->user()?->can('manage own profile'), 403);
        abort_unless($qualification->applicant_profile_id === $this->profile($request)->id, 404);
        $qualification->delete();

        return back()->with('success', 'Qualification removed.');
    }

    public function storeExperience(WorkExperienceSaveRequest $request): RedirectResponse
    {
        $data = $request->validated();
        if ($request->boolean('is_current')) {
            $data['end_date'] = null;
        }
        $this->profile($request)->workExperiences()->create($data);

        return back()->with('success', 'Work experience added.');
    }

    public function updateExperience(WorkExperienceSaveRequest $request, WorkExperience $experience): RedirectResponse
    {
        abort_unless($experience->applicant_profile_id === $this->profile($request)->id, 404);
        $data = $request->validated();
        if ($request->boolean('is_current')) {
            $data['end_date'] = null;
        }
        $experience->update($data);

        return back()->with('success', 'Work experience updated.');
    }

    public function destroyExperience(Request $request, WorkExperience $experience): RedirectResponse
    {
        abort_unless($request->user()?->can('manage own profile'), 403);
        abort_unless($experience->applicant_profile_id === $this->profile($request)->id, 404);
        $experience->delete();

        return back()->with('success', 'Work experience removed.');
    }

    public function photo(Request $request): StreamedResponse
    {
        $profile = $this->profile($request);
        abort_unless($profile->profile_photo, 404);

        return Storage::disk('local')->response($profile->profile_photo);
    }

    private function profile(Request $request): ApplicantProfile
    {
        return $request->user()->applicantProfile()->firstOrCreate([], ['nationality' => 'Nigerian']);
    }
}
