<?php

namespace App\Http\Controllers\Applicant;

use App\Enums\VacancyStatus;
use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VacancyController extends Controller
{
    public function index(Request $request): Response
    {
        $vacancies = Vacancy::query()
            ->with('department:id,name')
            ->withCount('requirements')
            ->where('status', VacancyStatus::PUBLISHED)
            ->whereDate('application_deadline', '>=', today())
            ->when($request->filled('search'), fn ($query) => $query->whereRaw('LOWER(title) LIKE ?', ['%'.mb_strtolower($request->string('search')->value()).'%']))
            ->when($request->filled('category'), fn ($query) => $query->where('employment_category', $request->string('category')->value()))
            ->orderBy('application_deadline')
            ->paginate(12)
            ->withQueryString();

        $appliedVacancyIds = $request->user()->applications()->pluck('vacancy_id');

        return Inertia::render('applicant/vacancies/index', [
            'vacancies' => $vacancies,
            'appliedVacancyIds' => $appliedVacancyIds,
            'filters' => $request->only(['search', 'category']),
        ]);
    }

    public function show(Request $request, Vacancy $vacancy): Response
    {
        abort_unless($vacancy->status === VacancyStatus::PUBLISHED && ! $vacancy->application_deadline->lt(today()), 404);
        $vacancy->load(['department:id,name', 'requirements']);

        return Inertia::render('applicant/vacancies/show', [
            'vacancy' => $vacancy,
            'hasApplied' => $request->user()->applications()->where('vacancy_id', $vacancy->id)->exists(),
        ]);
    }
}
