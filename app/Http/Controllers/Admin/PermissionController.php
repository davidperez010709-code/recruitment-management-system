<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PermissionSaveRequest;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/permissions/index', [
            'permissions' => Permission::query()->where('guard_name', 'web')->withCount('roles')->orderBy('name')->paginate(25),
        ]);
    }

    public function store(PermissionSaveRequest $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $permission = Permission::create(['name' => $request->validated('name'), 'guard_name' => 'web']);
        Role::where('name', 'SUPER_ADMIN')->where('guard_name', 'web')->first()?->givePermissionTo($permission);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $activityLogger->record($request->user(), 'permission.created', "Created permission {$permission->name}.", $permission, $request);

        return back()->with('success', 'Permission created.');
    }

    public function update(PermissionSaveRequest $request, Permission $permission, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($permission->guard_name === 'web', 404);
        $permission->update(['name' => $request->validated('name')]);
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $activityLogger->record($request->user(), 'permission.updated', "Renamed permission {$permission->name}.", $permission, $request);

        return back()->with('success', 'Permission updated.');
    }

    public function destroy(Request $request, Permission $permission, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('manage permissions'), 403);
        abort_unless($permission->guard_name === 'web', 404);
        if ($permission->roles()->exists()) {
            return back()->withErrors(['permission' => 'Remove this permission from roles before deleting it.']);
        }

        $name = $permission->name;
        $permission->delete();
        app(PermissionRegistrar::class)->forgetCachedPermissions();
        $activityLogger->record($request->user(), 'permission.deleted', "Deleted permission {$name}.", null, $request);

        return back()->with('success', 'Permission deleted.');
    }
}
