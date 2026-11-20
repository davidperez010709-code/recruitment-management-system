<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('review applications') || $user->can('submit applications');
    }

    public function view(User $user, Application $application): bool
    {
        // Applicants own only their records; HR and assigned interviewers have scoped access.
        if ($application->applicant_user_id === $user->id) {
            return true;
        }

        if ($user->can('review applications')) {
            return true;
        }

        return $user->can('view assigned interviews')
            && $application->interviews()->whereHas('panelMembers', fn ($query) => $query->whereKey($user->id))->exists();
    }

    public function screen(User $user, Application $application): bool
    {
        return $user->can('screen applications');
    }

    public function shortlist(User $user, Application $application): bool
    {
        return $user->can('shortlist applicants');
    }
}
