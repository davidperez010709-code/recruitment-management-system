<?php

namespace Database\Factories;

use App\Enums\EmploymentCategory;
use App\Enums\VacancyStatus;
use App\Models\Department;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Vacancy> */
class VacancyFactory extends Factory
{
    protected $model = Vacancy::class;

    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'created_by' => User::factory(),
            'title' => fake()->jobTitle(),
            'reference_number' => fake()->unique()->bothify('UIR-2026-######'),
            'description' => fake()->paragraphs(3, true),
            'job_type' => 'Full-time',
            'employment_category' => fake()->randomElement(EmploymentCategory::cases())->value,
            'location' => 'Ibadan, Nigeria',
            'number_of_positions' => fake()->numberBetween(1, 5),
            'minimum_qualification' => 'Bachelor degree or equivalent',
            'experience_required' => 'At least two years of relevant experience',
            'salary_range' => null,
            'application_deadline' => now()->addDays(fake()->numberBetween(10, 60))->toDateString(),
            'status' => VacancyStatus::DRAFT,
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => ['status' => VacancyStatus::PUBLISHED, 'published_at' => now()]);
    }
}
