<?php

namespace App\Http\Controllers\Admin;

use App\Enums\RecruitmentDecisionType;
use App\Http\Controllers\Controller;
use App\Http\Requests\RecruitmentDecisionSaveRequest;
use App\Models\Application;
use App\Services\ActivityLogger;
use App\Services\RecruitmentWorkflowService;
use Illuminate\Http\RedirectResponse;

class RecruitmentDecisionController extends Controller
{
    public function store(
        RecruitmentDecisionSaveRequest $request,
        Application $application,
        RecruitmentWorkflowService $workflow,
        ActivityLogger $activityLogger,
    ): RedirectResponse {
        $data = $request->validated();
        $decision = RecruitmentDecisionType::from($data['decision']);
        $record = $workflow->decide($application, $request->user(), $decision, $data['remarks'] ?? null);
        $activityLogger->record($request->user(), 'application.decision_recorded', "Recorded {$decision->value} decision for {$application->application_number}.", $record, $request);

        return back()->with('success', 'Recruitment decision recorded and applicant notified.');
    }
}
