<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserSaveRequest;
use App\Models\ApplicationScreening;
use App\Models\Department;
use App\Models\RecruitmentDecision;
use App\Models\User;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::query()
            ->with(['department', 'roles'])
            ->when($request->string('search')->trim()->value(), function ($query, string $search): void {
                $term = '%'.mb_strtolower($search).'%';
                $query->where(fn ($q) => $q->whereRaw('LOWER(name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(email) LIKE ?', [$term]));
            })
            ->when($request->filled('role'), fn ($query) => $query->role($request->string('role')->value()))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
            'roles' => Role::query()->where('guard_name', 'web')->orderBy('name')->pluck('name'),
            'canManageRoles' => $request->user()->can('manage roles'),
            'filters' => $request->only(['search', 'role']),
        ]);
    }

    public function store(UserSaveRequest $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $data = $request->validated();
        $roleNames = $data['roles'] ?? ['APPLICANT'];
        unset($data['roles']);

        $this->guardRoleAssignment($request, null, $roleNames);
        $roles = $this->webRoles($roleNames);

        $user = DB::transaction(function () use ($data, $roles): User {
            $user = User::create([
                ...$data,
                'password' => $data['password'],
                'is_active' => $data['is_active'] ?? true,
                'email_verified_at' => now(),
            ]);
            $user->syncRoles($roles);

            return $user;
        });

        $activityLogger->record($request->user(), 'user.created', "Created user {$user->email}.", $user, $request);

        return back()->with('success', 'User created.');
    }

    public function update(UserSaveRequest $request, User $user, ActivityLogger $activityLogger): RedirectResponse
    {
        $data = $request->validated();
        $roleNames = $data['roles'] ?? null;
        unset($data['roles']);

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $roles = null;
        if ($roleNames !== null) {
            $this->guardRoleAssignment($request, $user, $roleNames);
            $roles = $this->webRoles($roleNames);
        }

        if ($request->user()->is($user) && array_key_exists('is_active', $data) && ! $data['is_active']) {
            abort(422, 'You cannot deactivate your own account.');
        }

        DB::transaction(function () use ($data, $roleNames, $user, $roles): void {
            $user->update($data);
            if ($roleNames !== null) {
                $user->syncRoles($roles);
            }
        });

        $activityLogger->record($request->user(), 'user.updated', "Updated user {$user->email}.", $user, $request);

        return back()->with('success', 'User updated.');
    }

    public function destroy(Request $request, User $user, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('manage users'), 403);
        abort_if($request->user()->is($user), 422, 'You cannot delete your own account here.');

        if ($user->hasRole('SUPER_ADMIN') && User::role('SUPER_ADMIN')->count() <= 1) {
            return back()->withErrors(['user' => 'The last super administrator cannot be deleted.']);
        }

        if ($user->applications()->exists() || $user->createdVacancies()->exists()
            || $user->interviewEvaluations()->exists()
            || ApplicationScreening::where('screened_by', $user->id)->exists()
            || RecruitmentDecision::where('decided_by', $user->id)->exists()
            || $user->interviewsAsPanelMember()->exists()) {
            $user->update(['is_active' => false]);
            $activityLogger->record($request->user(), 'user.deactivated', "Deactivated user {$user->email}.", $user, $request);

            return back()->with('success', 'User has recruitment history and was deactivated.');
        }

        $email = $user->email;
        $user->delete();
        $activityLogger->record($request->user(), 'user.deleted', "Deleted user {$email}.", null, $request);

        return back()->with('success', 'User deleted.');
    }

    /** @param list<string> $roleNames */
    private function guardRoleAssignment(Request $request, ?User $target, array $roleNames): void
    {
        if (array_diff($roleNames, ['APPLICANT']) !== [] && ! $request->user()->can('manage roles')) {
            abort(403, 'You cannot assign roles.');
        }

        if ($target && $request->user()->is($target)) {
            $current = $target->getRoleNames()->sort()->values()->all();
            $proposed = collect($roleNames)->sort()->values()->all();
            if ($current !== $proposed) {
                abort(403, 'You cannot assign roles to yourself.');
            }
        }
    }

    /** @param list<string> $roleNames */
    private function webRoles(array $roleNames): Collection
    {
        $roles = Role::query()->where('guard_name', 'web')->whereIn('name', $roleNames)->get();
        abort_if($roles->count() !== count(array_unique($roleNames)), 422, 'One or more roles are invalid.');

        return $roles;
    }
}
