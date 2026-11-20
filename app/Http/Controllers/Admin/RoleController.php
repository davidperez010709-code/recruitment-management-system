<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\RoleSaveRequest;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/roles/index', [
            'roles' => Role::query()->where('guard_name', 'web')->with(['permissions'])->withCount('users')->orderBy('name')->get(),
            'permissions' => Permission::query()->where('guard_name', 'web')->orderBy('name')->pluck('name'),
        ]);
    }

    public function store(RoleSaveRequest $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $data = $request->validated();
        $permissionNames = $data['permissions'] ?? [];
        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($this->permissions($permissionNames));
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $activityLogger->record($request->user(), 'role.created', "Created role {$role->name}.", $role, $request);

        return back()->with('success', 'Role created.');
    }

    public function update(RoleSaveRequest $request, Role $role, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($role->guard_name === 'web', 404);
        abort_if($role->name === 'SUPER_ADMIN', 422, 'The super administrator role is protected.');
        $data = $request->validated();
        $role->update(['name' => $data['name']]);
        $role->syncPermissions($this->permissions($data['permissions'] ?? []));
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $activityLogger->record($request->user(), 'role.updated', "Updated role {$role->name}.", $role, $request);

        return back()->with('success', 'Role updated.');
    }

    public function destroy(Request $request, Role $role, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('manage roles'), 403);
        abort_unless($role->guard_name === 'web', 404);
        abort_if(in_array($role->name, ['SUPER_ADMIN', 'APPLICANT'], true), 422, 'This system role cannot be deleted.');
        if ($role->users()->exists()) {
            return back()->withErrors(['role' => 'Remove this role from users before deleting it.']);
        }

        $name = $role->name;
        $role->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $activityLogger->record($request->user(), 'role.deleted', "Deleted role {$name}.", null, $request);

        return back()->with('success', 'Role deleted.');
    }

    /** @param list<string> $names */
    private function permissions(array $names): Collection
    {
        $permissions = Permission::query()->where('guard_name', 'web')->whereIn('name', $names)->get();
        abort_if($permissions->count() !== count(array_unique($names)), 422, 'One or more permissions are invalid.');

        return $permissions;
    }
}
