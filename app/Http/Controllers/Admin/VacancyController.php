<?php

namespace App\Http\Controllers\Admin;

use App\Enums\EmploymentCategory;
use App\Enums\VacancyStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\VacancySaveRequest;
use App\Models\Department;
use App\Models\Vacancy;
use App\Services\ActivityLogger;
use App\Services\RecruitmentWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VacancyController extends Controller
{
    public function index(Request $request): Response
    {
        $vacancies = Vacancy::query()
            ->with('department')
            ->withCount('applications')
            ->when($request->filled('search'), fn ($query) => $query->whereRaw('LOWER(title) LIKE ?', ['%'.mb_strtolower($request->string('search')->value()).'%']))
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->string('status')->value()))
            ->when($request->filled('department_id'), fn ($query) => $query->where('department_id', $request->integer('department_id')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/vacancies/index', [
            'vacancies' => $vacancies,
            'departments' => Department::query()->orderBy('name')->get(['id', 'name']),
            'statuses' => array_column(VacancyStatus::cases(), 'value'),
            'filters' => $request->only(['search', 'status', 'department_id']),
        ]);
    }

    public function create(): Response
    {
        abort_unless(request()->user()?->can('create vacancies'), 403);

        return Inertia::render('admin/vacancies/form', [
            'vacancy' => null,
            'departments' => Department::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'categories' => array_column(EmploymentCategory::cases(), 'value'),
        ]);
    }

    public function edit(Vacancy $vacancy): Response
    {
        abort_unless(request()->user()?->can('update vacancies'), 403);

        return Inertia::render('admin/vacancies/form', [
            'vacancy' => $vacancy->load('requirements'),
            'departments' => Department::query()->where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'categories' => array_column(EmploymentCategory::cases(), 'value'),
        ]);
    }

    public function store(VacancySaveRequest $request, ActivityLogger $activityLogger): RedirectResponse
    {
        $data = $request->validated();
        $requirements = $data['requirements'] ?? [];
        unset($data['requirements']);

        $vacancy = DB::transaction(function () use ($data, $requirements, $request): Vacancy {
            $vacancy = Vacancy::create([
                ...$data,
                'created_by' => $request->user()->id,
                'reference_number' => $this->referenceNumber(),
                'status' => VacancyStatus::DRAFT,
            ]);
            $vacancy->requirements()->createMany($requirements);

            return $vacancy;
        });

        $activityLogger->record($request->user(), 'vacancy.created', "Created vacancy {$vacancy->reference_number}.", $vacancy, $request);

        return to_route('admin.vacancies.index')->with('success', 'Vacancy saved as a draft.');
    }

    public function update(VacancySaveRequest $request, Vacancy $vacancy, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_if($vacancy->status === VacancyStatus::CANCELLED, 422, 'Cancelled vacancies cannot be edited.');
        $data = $request->validated();
        $requirements = $data['requirements'] ?? [];
        unset($data['requirements']);

        DB::transaction(function () use ($vacancy, $data, $requirements): void {
            $vacancy->update($data);
            $vacancy->requirements()->delete();
            $vacancy->requirements()->createMany($requirements);
        });

        $activityLogger->record($request->user(), 'vacancy.updated', "Updated vacancy {$vacancy->reference_number}.", $vacancy, $request);

        return to_route('admin.vacancies.index')->with('success', 'Vacancy updated.');
    }

    public function publish(Request $request, Vacancy $vacancy, RecruitmentWorkflowService $workflow, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('publish vacancies'), 403);
        $workflow->publishVacancy($vacancy);
        $activityLogger->record($request->user(), 'vacancy.published', "Published vacancy {$vacancy->reference_number}.", $vacancy, $request);

        return back()->with('success', 'Vacancy published.');
    }

    public function close(Request $request, Vacancy $vacancy, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('update vacancies'), 403);
        abort_unless($vacancy->status === VacancyStatus::PUBLISHED, 422, 'Only published vacancies can be closed.');
        $vacancy->update(['status' => VacancyStatus::CLOSED]);
        $activityLogger->record($request->user(), 'vacancy.closed', "Closed vacancy {$vacancy->reference_number}.", $vacancy, $request);

        return back()->with('success', 'Vacancy closed.');
    }

    public function cancel(Request $request, Vacancy $vacancy, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('update vacancies'), 403);
        abort_if(in_array($vacancy->status, [VacancyStatus::CLOSED, VacancyStatus::CANCELLED], true), 422, 'This vacancy cannot be cancelled.');
        $vacancy->update(['status' => VacancyStatus::CANCELLED]);
        $activityLogger->record($request->user(), 'vacancy.cancelled', "Cancelled vacancy {$vacancy->reference_number}.", $vacancy, $request);

        return back()->with('success', 'Vacancy cancelled.');
    }

    public function destroy(Request $request, Vacancy $vacancy, ActivityLogger $activityLogger): RedirectResponse
    {
        abort_unless($request->user()?->can('update vacancies'), 403);
        if ($vacancy->status !== VacancyStatus::DRAFT || $vacancy->applications()->exists()) {
            return back()->withErrors(['vacancy' => 'Only draft vacancies without applications can be deleted.']);
        }

        $reference = $vacancy->reference_number;
        $vacancy->delete();
        $activityLogger->record($request->user(), 'vacancy.deleted', "Deleted draft vacancy {$reference}.", null, $request);

        return back()->with('success', 'Draft vacancy deleted.');
    }

    private function referenceNumber(): string
    {
        do {
            $reference = 'UIR-'.now()->format('Y').'-'.Str::upper(Str::random(6));
        } while (Vacancy::where('reference_number', $reference)->exists());

        return $reference;
    }
}
