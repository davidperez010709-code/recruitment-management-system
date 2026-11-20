<?php

namespace Tests\Feature;

use App\Enums\ApplicationStatus;
use App\Enums\RecruitmentDecisionType;
use App\Enums\ScreeningResult;
use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\ApplicationDocument;
use App\Models\Department;
use App\Models\Interview;
use App\Models\Qualification;
use App\Models\User;
use App\Models\Vacancy;
use App\Services\RecruitmentWorkflowService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RecruitmentWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_applicant_can_submit_once_and_documents_stay_on_private_storage(): void
    {
        Storage::fake('local');
        $applicant = $this->applicantWithCompleteProfile();
        $vacancy = $this->publishedVacancy();
        $this->actingAs($applicant);

        $response = $this->post(route('applicant.applications.store', $vacancy), [
            'cover_letter' => 'I am interested in this role.',
            'documents' => [
                ['type' => 'cv', 'file' => UploadedFile::fake()->create('resume.pdf', 128, 'application/pdf')],
            ],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseCount('applications', 1);
        $document = ApplicationDocument::query()->firstOrFail();
        Storage::disk('local')->assertExists($document->file_path);
        $this->assertStringStartsWith('application-documents/', $document->file_path);

        $this->post(route('applicant.applications.store', $vacancy), [])->assertSessionHasErrors('application');
        $this->assertDatabaseCount('applications', 1);
    }

    public function test_applicants_cannot_view_another_applicants_application_or_download_its_documents(): void
    {
        Storage::fake('local');
        $owner = $this->applicantWithCompleteProfile();
        $otherApplicant = $this->applicantWithCompleteProfile();
        $application = Application::factory()->create(['applicant_user_id' => $owner->id]);
        $path = "application-documents/{$application->id}/private.pdf";
        Storage::disk('local')->put($path, 'private applicant document');
        $document = $application->documents()->create([
            'document_type' => 'cv',
            'document_name' => 'private.pdf',
            'file_path' => $path,
            'mime_type' => 'application/pdf',
            'file_size' => 27,
        ]);

        $this->actingAs($otherApplicant)
            ->get(route('applicant.applications.show', $application))
            ->assertForbidden();
        $this->get(route('application-documents.download', $document))->assertForbidden();
    }

    public function test_applicant_profile_and_phone_save_together_and_replaced_photos_are_removed(): void
    {
        Storage::fake('local');
        $applicant = $this->applicantWithCompleteProfile();
        $this->actingAs($applicant);

        $payload = [
            'phone' => '08098765432',
            'nationality' => 'Nigerian',
            'address' => 'Ibadan, Oyo State',
            'state_of_origin' => 'Oyo',
            'profile_photo' => UploadedFile::fake()->image('first-photo.jpg'),
        ];
        $this->put(route('applicant.profile.update'), $payload)->assertRedirect();
        $profile = $applicant->applicantProfile()->firstOrFail();
        $oldPhoto = $profile->profile_photo;
        Storage::disk('local')->assertExists($oldPhoto);
        $this->assertSame('08098765432', $applicant->fresh()->phone);

        $payload['profile_photo'] = UploadedFile::fake()->image('second-photo.jpg');
        $this->put(route('applicant.profile.update'), $payload)->assertRedirect();
        $newPhoto = $profile->fresh()->profile_photo;
        $this->assertNotSame($oldPhoto, $newPhoto);
        Storage::disk('local')->assertMissing($oldPhoto);
        Storage::disk('local')->assertExists($newPhoto);
    }

    public function test_screening_shortlisting_interview_evaluation_and_final_decision_work_in_order(): void
    {
        $applicant = $this->applicantWithCompleteProfile();
        $hrOfficer = User::factory()->create();
        $hrOfficer->assignRole('HR_OFFICER');
        $hrAdmin = User::factory()->create();
        $hrAdmin->assignRole('HR_ADMIN');
        $interviewer = User::factory()->create();
        $interviewer->assignRole('INTERVIEWER');
        $vacancy = $this->publishedVacancy();
        $application = Application::factory()->create([
            'vacancy_id' => $vacancy->id,
            'applicant_user_id' => $applicant->id,
            'status' => ApplicationStatus::SUBMITTED,
        ]);
        $workflow = app(RecruitmentWorkflowService::class);

        $workflow->screen($application, $hrOfficer, [
            'screening_score' => 88,
            'remarks' => 'Meets the listed qualifications.',
            'result' => ScreeningResult::QUALIFIED,
        ]);
        $application->refresh();
        $this->assertSame(ApplicationStatus::UNDER_REVIEW, $application->status);

        $workflow->shortlist($application);
        $application->refresh();
        $this->assertSame(ApplicationStatus::SHORTLISTED, $application->status);

        $interview = $workflow->scheduleInterview($application, [
            'interview_type' => 'Panel interview',
            'interview_date' => now()->addDays(3),
            'location' => 'Human Resources Conference Room',
            'instructions' => 'Bring original credentials.',
        ], [$interviewer->id]);
        $evaluation = $workflow->evaluate($interview, $interviewer, [
            'technical_score' => 90,
            'communication_score' => 80,
            'experience_score' => 70,
            'comments' => 'Strong overall performance.',
            'recommendation' => 'RECOMMEND',
        ]);
        $this->assertSame('80.00', $evaluation->refresh()->overall_score);
        $this->assertSame(ApplicationStatus::INTERVIEW_COMPLETED, $application->refresh()->status);

        $decision = $workflow->decide($application, $hrAdmin, RecruitmentDecisionType::SELECTED, 'Recommended by the panel.');
        $this->assertSame(RecruitmentDecisionType::SELECTED, $decision->decision);
        $this->assertSame(ApplicationStatus::SELECTED, $application->refresh()->status);
    }

    public function test_unassigned_interviewer_cannot_submit_an_evaluation(): void
    {
        $application = Application::factory()->create(['status' => ApplicationStatus::INTERVIEW_SCHEDULED]);
        $interview = Interview::factory()->create(['application_id' => $application->id]);
        $assigned = User::factory()->create();
        $assigned->assignRole('INTERVIEWER');
        $unassigned = User::factory()->create();
        $unassigned->assignRole('INTERVIEWER');
        $interview->panelMembers()->attach($assigned);

        $payload = [
            'technical_score' => 85,
            'communication_score' => 85,
            'experience_score' => 85,
            'recommendation' => 'RECOMMEND',
        ];

        $this->actingAs($unassigned)
            ->post(route('interviews.evaluation.store', $interview), $payload)
            ->assertForbidden();
        $this->assertDatabaseCount('interview_evaluations', 0);
    }

    public function test_role_permissions_block_applicants_from_administration_routes(): void
    {
        $this->actingAs($this->applicantWithCompleteProfile())
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    private function applicantWithCompleteProfile(): User
    {
        $user = User::factory()->create(['phone' => '08012345678']);
        $user->assignRole('APPLICANT');
        $profile = ApplicantProfile::factory()->create(['user_id' => $user->id]);
        Qualification::factory()->create(['applicant_profile_id' => $profile->id]);

        return $user;
    }

    private function publishedVacancy(): Vacancy
    {
        $creator = User::factory()->create();
        $department = Department::factory()->create();

        return Vacancy::factory()->published()->create([
            'created_by' => $creator->id,
            'department_id' => $department->id,
        ]);
    }
}
