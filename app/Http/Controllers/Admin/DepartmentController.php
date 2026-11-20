<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentSaveRequest;
use App\Models\Department;
use App\Services\ActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(Request $request): Response
    {
        $departments = Department::query()
            ->withCount(['users', 'vacancies'])
            ->when($request->string('search')->trim()->value(), function ($query, string $search): void {
                $term = '%'.mb_strtolower($search).'%';
                $query->where(fn ($q) => $q->whereRaw('LOWER(name) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(code) LIKE ?', [$term]));
            })
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/departments/index', [
            'departments' => $departments,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(DepartmentSaveRequest $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $department = Department::create($request->validated());
        $activityLogger->record($request->user(), 'department.created', "Created department {$department->code}.", $department, $request);

        return back()->with('success', 'Department created.');
    }

    public function update(DepartmentSaveRequest $request, Department $department, ActivityLogger $activityLogger): RedirectResponse
    {
        $department->update($request->validated());
        $activityLogger->record($request->user(), 'department.updated', "Updated department {$department->code}.", $department, $request);

        return back()->with('success', 'Department updated.');
    }

    public function destroy(Request $request, Department $department, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('manage departments'), 403);

        if ($department->users()->exists() || $department->vacancies()->exists()) {
            return back()->withErrors(['department' => 'Departments with users or vacancies cannot be deleted.']);
        }

        $department->delete();
        $activityLogger->record($request->user(), 'department.deleted', "Deleted department {$department->code}.", null, $request);

        return back()->with('success', 'Department deleted.');
    }
}
