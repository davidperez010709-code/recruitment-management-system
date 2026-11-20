<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Vacancy;

class VacancyPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->can('view vacancies');
    }

    public function view(User $user, Vacancy $vacancy): bool
    {
        return $vacancy->status->value === 'PUBLISHED'
            || $user->can('update vacancies');
    }

    public function create(User $user): bool
    {
        return $user->can('create vacancies');
    }

    public function update(User $user, Vacancy $vacancy): bool
    {
        return $user->can('update vacancies');
    }

    public function publish(User $user, Vacancy $vacancy): bool
    {
        return $user->can('publish vacancies');
    }
}
