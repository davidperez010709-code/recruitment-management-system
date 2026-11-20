<?php

namespace App\Http\Controllers;

use App\Http\Requests\InterviewEvaluationSaveRequest;
use App\Models\Interview;
use App\Services\ActivityLogger;
use App\Services\RecruitmentWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class InterviewEvaluationController extends Controller
{
    public function create(Interview $interview): Response
    {
        $this->authorize('evaluate', $interview);
        $existing = $interview->evaluations()->where('evaluator_id', request()->user()->id)->first();
        abort_if($existing, 409, 'You have already submitted an evaluation.');

        return Inertia::render('interviewer/evaluations/create', [
            'interview' => $interview->load('application.applicant:id,name', 'application.vacancy:id,title'),
        ]);
    }

    public function store(
        InterviewEvaluationSaveRequest $request,
        Interview $interview,
        RecruitmentWorkflowService $workflow,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        $this->authorize('evaluate', $interview);
        if ($interview->evaluations()->where('evaluator_id', $request->user()->id)->exists()) {
            throw ValidationException::withMessages(['evaluation' => 'You have already submitted an evaluation for this interview.']);
        }

        $evaluation = $workflow->evaluate($interview, $request->user(), $request->validated());
        $activityLogger->record($request->user(), 'interview.evaluated', "Submitted evaluation for interview {$interview->id}.", $evaluation, $request);

        return to_route('interviews.show', $interview)->with('success', 'Evaluation submitted.');
    }
}
