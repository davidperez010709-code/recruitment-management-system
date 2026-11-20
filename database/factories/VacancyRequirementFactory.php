<?php

namespace Database\Factories;

use App\Models\Vacancy;
use App\Models\VacancyRequirement;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<VacancyRequirement> */
class VacancyRequirementFactory extends Factory
{
    protected $model = VacancyRequirement::class;

    public function definition(): array
    {
        return [
            'vacancy_id' => Vacancy::factory(),
            'requirement' => fake()->sentence(),
            'requirement_type' => 'qualification',
            'is_mandatory' => true,
        ];
    }
}
