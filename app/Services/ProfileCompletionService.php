<?php

namespace App\Services;

use App\Models\ApplicantProfile;
use App\Models\User;

class ProfileCompletionService
{
    public function percentage(User $user, ?ApplicantProfile $profile = null): int
    {
        $profile ??= $user->applicantProfile()->withCount(['qualifications', 'workExperiences'])->first();

        // A missing profile starts at zero; otherwise each checklist item contributes equally.
        if (! $profile) {
            return 0;
        }

        $checks = [
            filled($user->phone),
            filled($profile->date_of_birth),
            filled($profile->gender),
            filled($profile->address),
            filled($profile->state_of_origin),
            filled($profile->nationality),
            $profile->qualifications()->exists(),
            $profile->workExperiences()->exists(),
        ];

        return (int) round(count(array_filter($checks)) / count($checks) * 100);
    }

    public function isReadyToApply(User $user): bool
    {
        $profile = $user->applicantProfile;

        // Readiness is a minimum application rule, so it is intentionally stricter than completion.
        return $profile !== null
            && filled($profile->date_of_birth)
            && filled($profile->address)
            && filled($profile->state_of_origin)
            && $profile->qualifications()->exists();
    }
}
