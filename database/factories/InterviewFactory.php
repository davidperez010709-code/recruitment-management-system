<?php

namespace Database\Factories;

use App\Enums\InterviewStatus;
use App\Models\Application;
use App\Models\Interview;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Interview> */
class InterviewFactory extends Factory
{
    protected $model = Interview::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'interview_type' => 'Panel interview',
            'interview_date' => now()->addDays(fake()->numberBetween(2, 30)),
            'location' => 'Human Resources Conference Room',
            'instructions' => fake()->sentence(),
            'status' => InterviewStatus::SCHEDULED,
        ];
    }
}
