<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /** @var array<string, list<string>> */
    private const ROLE_PERMISSIONS = [
        'HR_ADMIN' => [
            'view vacancies',
            'create vacancies',
            'update vacancies',
            'publish vacancies',
            'review applications',
            'screen applications',
            'shortlist applicants',
            'schedule interviews',
            'manage interview panels',
            'view assigned interviews',
            'evaluate candidates',
            'manage recruitment decisions',
            'view reports',
        ],
        'HR_OFFICER' => [
            'view vacancies',
            'review applications',
            'screen applications',
            'shortlist applicants',
            'view assigned interviews',
        ],
        'INTERVIEWER' => [
            'view assigned interviews',
            'evaluate candidates',
        ],
        'APPLICANT' => [
            'view vacancies',
            'submit applications',
            'manage own profile',
        ],
    ];

    /** @var list<string> */
    private const PERMISSIONS = [
        'manage users',
        'manage roles',
        'manage permissions',
        'view activity logs',
        'manage departments',
        'view vacancies',
        'create vacancies',
        'update vacancies',
        'publish vacancies',
        'submit applications',
        'review applications',
        'screen applications',
        'shortlist applicants',
        'schedule interviews',
        'manage interview panels',
        'view assigned interviews',
        'evaluate candidates',
        'manage recruitment decisions',
        'manage own profile',
        'view reports',
    ];

    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = collect(self::PERMISSIONS)
            ->map(fn (string $name) => Permission::findOrCreate($name, 'web'));

        $superAdmin = Role::findOrCreate('SUPER_ADMIN', 'web');
        $superAdmin->syncPermissions($permissions);

        foreach (self::ROLE_PERMISSIONS as $roleName => $permissionNames) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($permissionNames);
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
