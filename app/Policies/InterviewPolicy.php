<?php

namespace App\Policies;

use App\Models\Interview;
use App\Models\User;

class InterviewPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view assigned interviews') || $user->can('manage interview panels');
    }

    public function view(User $user, Interview $interview): bool
    {
        // HR panel managers can review all sessions; interviewers are limited to assignments.
        return $user->can('manage interview panels')
            || $interview->panelMembers()->whereKey($user->id)->exists();
    }

    public function evaluate(User $user, Interview $interview): bool
    {
        return $user->can('evaluate candidates')
            && $interview->panelMembers()->whereKey($user->id)->exists();
    }
}
