<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('local')) {
            return;
        }

        $password = (string) config('rms.demo_password', 'ChangeMe123!');
        $hrDepartmentId = Department::where('code', 'HR')->value('id');

        $users = [
            ['name' => 'System Administrator', 'email' => 'superadmin@example.com', 'role' => 'SUPER_ADMIN'],
            ['name' => 'HR Administrator', 'email' => 'hr.admin@example.com', 'role' => 'HR_ADMIN', 'department_id' => $hrDepartmentId],
            ['name' => 'HR Officer', 'email' => 'hr.officer@example.com', 'role' => 'HR_OFFICER', 'department_id' => $hrDepartmentId],
            ['name' => 'Interview Panel Member', 'email' => 'interviewer@example.com', 'role' => 'INTERVIEWER'],
            ['name' => 'Demo Applicant', 'email' => 'applicant@example.com', 'role' => 'APPLICANT'],
        ];

        foreach ($users as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $password,
                    'department_id' => $data['department_id'] ?? null,
                    'is_active' => true,
                    'email_verified_at' => now(),
                ],
            );

            $user->syncRoles($data['role']);
        }
    }
}
