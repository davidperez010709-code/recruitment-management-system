<?php

namespace Database\Factories;

use App\Models\ApplicantProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ApplicantProfile> */
class ApplicantProfileFactory extends Factory
{
    protected $model = ApplicantProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'date_of_birth' => fake()->dateTimeBetween('-55 years', '-21 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['Female', 'Male']),
            'address' => fake()->address(),
            'state_of_origin' => fake()->randomElement(['Oyo', 'Lagos', 'Kano', 'Enugu']),
            'nationality' => 'Nigerian',
        ];
    }
}
