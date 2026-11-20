<?php

namespace Database\Factories;

use App\Enums\ScreeningResult;
use App\Models\Application;
use App\Models\ApplicationScreening;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ApplicationScreening> */
class ApplicationScreeningFactory extends Factory
{
    protected $model = ApplicationScreening::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'screened_by' => User::factory(),
            'screening_score' => fake()->randomFloat(2, 40, 100),
            'remarks' => fake()->sentence(),
            'result' => ScreeningResult::QUALIFIED,
            'screened_at' => now(),
        ];
    }
}
