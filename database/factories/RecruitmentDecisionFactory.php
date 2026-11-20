<?php

namespace Database\Factories;

use App\Enums\RecruitmentDecisionType;
use App\Models\Application;
use App\Models\RecruitmentDecision;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<RecruitmentDecision> */
class RecruitmentDecisionFactory extends Factory
{
    protected $model = RecruitmentDecision::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'decided_by' => User::factory(),
            'decision' => RecruitmentDecisionType::SELECTED,
            'remarks' => fake()->sentence(),
            'decision_date' => now(),
        ];
    }
}
