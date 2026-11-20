<?php

namespace Database\Factories;

use App\Enums\ApplicationStatus;
use App\Models\Application;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Application> */
class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        return [
            'vacancy_id' => Vacancy::factory()->published(),
            'applicant_user_id' => User::factory(),
            'application_number' => fake()->unique()->bothify('APP-2026-????????'),
            'cover_letter' => fake()->paragraph(),
            'status' => ApplicationStatus::SUBMITTED,
            'submitted_at' => now(),
        ];
    }
}
