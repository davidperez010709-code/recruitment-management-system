<?php

namespace Database\Seeders;

use App\Enums\EmploymentCategory;
use App\Enums\VacancyStatus;
use App\Models\Department;
use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    public function run(): void
    {
        $creator = User::where('email', 'hr.admin@example.com')->firstOrFail();
        $roles = [
            [
                'reference_number' => 'UIR-2026-ACA001',
                'department' => 'CSC',
                'title' => 'Lecturer II, Computer Science',
                'category' => EmploymentCategory::ACADEMIC,
                'job_type' => 'Full-time',
                'qualification' => 'Ph.D. in Computer Science or a closely related discipline',
                'experience' => 'Teaching and research experience in software engineering, data science, or cybersecurity.',
                'description' => 'Contribute to undergraduate and postgraduate teaching, supervise student research, and develop an active research programme in Computer Science.',
            ],
            [
                'reference_number' => 'UIR-2026-ADM001',
                'department' => 'ACC',
                'title' => 'Senior Accountant',
                'category' => EmploymentCategory::ADMINISTRATIVE,
                'job_type' => 'Full-time',
                'qualification' => 'B.Sc. in Accounting and a recognized professional accounting qualification',
                'experience' => 'At least five years of progressive accounting experience.',
                'description' => 'Support financial reporting, budget monitoring, and internal controls in a university finance unit.',
            ],
            [
                'reference_number' => 'UIR-2026-TEC001',
                'department' => 'CSC',
                'title' => 'Computer Laboratory Technologist',
                'category' => EmploymentCategory::TECHNICAL,
                'job_type' => 'Full-time',
                'qualification' => 'B.Sc. or HND in Computer Science, Computer Engineering, or a related field',
                'experience' => 'Experience maintaining computer laboratories and supporting end users.',
                'description' => 'Maintain teaching laboratories, support practical sessions, and help keep departmental computing equipment available and secure.',
            ],
            [
                'reference_number' => 'UIR-2026-NAC001',
                'department' => 'ADM',
                'title' => 'Administrative Officer',
                'category' => EmploymentCategory::NON_ACADEMIC,
                'job_type' => 'Full-time',
                'qualification' => 'Bachelor degree in Public Administration, Management, or a related field',
                'experience' => 'At least three years of office administration experience.',
                'description' => 'Coordinate records, correspondence, and day-to-day administrative support for a university office.',
            ],
            [
                'reference_number' => 'UIR-2026-ADM002',
                'department' => 'ADM',
                'title' => 'Recruitment Data Assistant',
                'category' => EmploymentCategory::ADMINISTRATIVE,
                'job_type' => 'Fixed-term',
                'qualification' => 'B.Sc. in Statistics, Information Systems, or a related discipline',
                'experience' => 'Experience handling structured records and spreadsheet reports is an advantage.',
                'description' => 'Provide fixed-term support for recruitment records, application tracking, and administrative reporting.',
            ],
        ];

        foreach ($roles as $index => $role) {
            $department = Department::where('code', $role['department'])->firstOrFail();
            $vacancy = Vacancy::updateOrCreate(
                ['reference_number' => $role['reference_number']],
                [
                    'department_id' => $department->id,
                    'created_by' => $creator->id,
                    'title' => $role['title'],
                    'description' => $role['description'],
                    'job_type' => $role['job_type'],
                    'employment_category' => $role['category'],
                    'location' => 'Ibadan, Nigeria',
                    'number_of_positions' => $index === 0 ? 2 : 1,
                    'minimum_qualification' => $role['qualification'],
                    'experience_required' => $role['experience'],
                    'salary_range' => null,
                    'application_deadline' => today()->addDays(45),
                    'status' => $index === 4 ? VacancyStatus::DRAFT : VacancyStatus::PUBLISHED,
                    'published_at' => $index === 4 ? null : now()->subDays(2),
                ],
            );

            if (! $vacancy->requirements()->exists()) {
                $vacancy->requirements()->createMany([
                    ['requirement' => 'Provide evidence of the stated minimum qualification.', 'requirement_type' => 'qualification', 'is_mandatory' => true],
                    ['requirement' => 'Submit a current curriculum vitae and contact details for referees.', 'requirement_type' => 'document', 'is_mandatory' => true],
                ]);
            }
        }
    }
}
