<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class ApplicantSeeder extends Seeder
{
    public function run(): void
    {
        $password = (string) env('RMS_DEMO_PASSWORD', 'ChangeMe123!');
        $candidates = [
            ['Candidate One', 'candidate.one@example.com', 'Computer Science'],
            ['Candidate Two', 'candidate.two@example.com', 'Accounting'],
            ['Candidate Three', 'candidate.three@example.com', 'Computer Science'],
            ['Candidate Four', 'candidate.four@example.com', 'Computer Engineering'],
            ['Candidate Five', 'candidate.five@example.com', 'Public Administration'],
            ['Candidate Six', 'candidate.six@example.com', 'Computer Science'],
            ['Candidate Seven', 'candidate.seven@example.com', 'Accounting'],
        ];

        foreach ($candidates as $index => [$name, $email, $field]) {
            $user = User::updateOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => $password, 'email_verified_at' => now(), 'is_active' => true],
            );
            $user->syncRoles('APPLICANT');

            $profile = $user->applicantProfile()->updateOrCreate([], [
                'date_of_birth' => today()->subYears(28 + $index)->subDays(50),
                'gender' => $index % 2 === 0 ? 'Female' : 'Male',
                'address' => ($index + 1).' University Road, Ibadan',
                'state_of_origin' => ['Oyo', 'Lagos', 'Osun', 'Ogun'][$index % 4],
                'nationality' => 'Nigerian',
            ]);

            $profile->qualifications()->updateOrCreate(
                ['institution_name' => 'University of Ibadan', 'qualification' => $index < 3 ? 'M.Sc.' : 'B.Sc.'],
                ['field_of_study' => $field, 'grade' => 'Second Class Upper', 'graduation_year' => 2018 + ($index % 5)],
            );

            if ($index > 0) {
                $profile->workExperiences()->firstOrCreate(
                    ['organization' => 'Demonstration Employer '.$index, 'job_title' => 'Professional Officer'],
                    ['employment_type' => 'Full-time', 'start_date' => today()->subYears(4), 'end_date' => today()->subYear(), 'responsibilities' => 'Supported operations, reporting, and collaborative project delivery.', 'is_current' => false],
                );
            }
        }
    }
}
