<?php

namespace Database\Factories;

use App\Models\Interview;
use App\Models\InterviewEvaluation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<InterviewEvaluation> */
class InterviewEvaluationFactory extends Factory
{
    protected $model = InterviewEvaluation::class;

    public function definition(): array
    {
        $technical = fake()->randomFloat(2, 50, 100);
        $communication = fake()->randomFloat(2, 50, 100);
        $experience = fake()->randomFloat(2, 50, 100);

        return [
            'interview_id' => Interview::factory(),
            'evaluator_id' => User::factory(),
            'technical_score' => $technical,
            'communication_score' => $communication,
            'experience_score' => $experience,
            'overall_score' => round(($technical + $communication + $experience) / 3, 2),
            'comments' => fake()->paragraph(),
            'recommendation' => 'RECOMMEND',
        ];
    }
}
