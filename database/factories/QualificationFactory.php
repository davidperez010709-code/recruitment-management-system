<?php

namespace Database\Factories;

use App\Models\ApplicantProfile;
use App\Models\Qualification;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Qualification> */
class QualificationFactory extends Factory
{
    protected $model = Qualification::class;

    public function definition(): array
    {
        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'institution_name' => fake()->randomElement(['University of Ibadan', 'University of Lagos', 'Obafemi Awolowo University']),
            'qualification' => fake()->randomElement(['B.Sc.', 'M.Sc.', 'Ph.D.', 'HND']),
            'field_of_study' => fake()->randomElement(['Computer Science', 'Accounting', 'Mathematics', 'Public Administration']),
            'grade' => fake()->randomElement(['First Class', 'Second Class Upper', 'Distinction']),
            'graduation_year' => fake()->numberBetween(2000, (int) now()->year),
        ];
    }
}
