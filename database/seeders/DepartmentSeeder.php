<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Human Resources', 'code' => 'HR'],
            ['name' => 'Computer Science', 'code' => 'CSC'],
            ['name' => 'Mathematics', 'code' => 'MTH'],
            ['name' => 'Accounting', 'code' => 'ACC'],
            ['name' => 'Administration', 'code' => 'ADM'],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['code' => $department['code']],
                ['name' => $department['name'], 'is_active' => true],
            );
        }
    }
}
