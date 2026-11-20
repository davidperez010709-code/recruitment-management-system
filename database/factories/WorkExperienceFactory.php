<?php

namespace Database\Factories;

use App\Models\ApplicantProfile;
use App\Models\WorkExperience;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<WorkExperience> */
class WorkExperienceFactory extends Factory
{
    protected $model = WorkExperience::class;

    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-10 years', '-2 years');

        return [
            'applicant_profile_id' => ApplicantProfile::factory(),
            'organization' => fake()->company(),
            'job_title' => fake()->jobTitle(),
            'employment_type' => 'Full-time',
            'start_date' => $start->format('Y-m-d'),
            'end_date' => fake()->dateTimeBetween($start, 'now')->format('Y-m-d'),
            'responsibilities' => fake()->paragraph(),
            'is_current' => false,
        ];
    }
}
