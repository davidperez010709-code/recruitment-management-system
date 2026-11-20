<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\RecruitmentDecisionController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\VacancyController as AdminVacancyController;
use App\Http\Controllers\Applicant\ApplicationController as ApplicantApplicationController;
use App\Http\Controllers\Applicant\ProfileController as ApplicantProfileController;
use App\Http\Controllers\Applicant\VacancyController as ApplicantVacancyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InterviewController;
use App\Http\Controllers\InterviewEvaluationController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\EnsureUserIsActive;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', EnsureUserIsActive::class])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'read'])->name('notifications.read');

    Route::middleware('permission:view vacancies')->group(function () {
        Route::get('vacancies', [ApplicantVacancyController::class, 'index'])->name('vacancies.index');
        Route::get('vacancies/{vacancy}', [ApplicantVacancyController::class, 'show'])->name('vacancies.show');
    });

    Route::middleware('permission:manage own profile')->prefix('applicant/profile')->name('applicant.profile.')->group(function () {
        Route::get('/', [ApplicantProfileController::class, 'edit'])->name('edit');
        Route::put('/', [ApplicantProfileController::class, 'update'])->name('update');
        Route::get('photo', [ApplicantProfileController::class, 'photo'])->name('photo');
        Route::post('qualifications', [ApplicantProfileController::class, 'storeQualification'])->name('qualifications.store');
        Route::put('qualifications/{qualification}', [ApplicantProfileController::class, 'updateQualification'])->name('qualifications.update');
        Route::delete('qualifications/{qualification}', [ApplicantProfileController::class, 'destroyQualification'])->name('qualifications.destroy');
        Route::post('experiences', [ApplicantProfileController::class, 'storeExperience'])->name('experiences.store');
        Route::put('experiences/{experience}', [ApplicantProfileController::class, 'updateExperience'])->name('experiences.update');
        Route::delete('experiences/{experience}', [ApplicantProfileController::class, 'destroyExperience'])->name('experiences.destroy');
    });

    Route::middleware('permission:submit applications')->group(function () {
        Route::get('applications', [ApplicantApplicationController::class, 'index'])->name('applicant.applications.index');
        Route::post('vacancies/{vacancy}/applications', [ApplicantApplicationController::class, 'store'])->name('applicant.applications.store');
    });
    Route::get('applications/{application}', [ApplicantApplicationController::class, 'show'])->name('applicant.applications.show');
    Route::get('application-documents/{document}/download', [ApplicantApplicationController::class, 'downloadDocument'])->name('application-documents.download');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::middleware('permission:manage departments')->group(function () {
            Route::get('departments', [DepartmentController::class, 'index'])->name('departments.index');
            Route::post('departments', [DepartmentController::class, 'store'])->name('departments.store');
            Route::put('departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
            Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');
        });

        Route::middleware('permission:manage users')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
            Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });

        Route::middleware('permission:manage roles')->group(function () {
            Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
            Route::post('roles', [RoleController::class, 'store'])->name('roles.store');
            Route::put('roles/{role}', [RoleController::class, 'update'])->name('roles.update');
            Route::delete('roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy');
        });

        Route::middleware('permission:manage permissions')->group(function () {
            Route::get('permissions', [PermissionController::class, 'index'])->name('permissions.index');
            Route::post('permissions', [PermissionController::class, 'store'])->name('permissions.store');
            Route::put('permissions/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
            Route::delete('permissions/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');
        });

        Route::middleware('permission:view vacancies')->group(function () {
            Route::get('vacancies', [AdminVacancyController::class, 'index'])->name('vacancies.index');
        });
        Route::middleware('permission:create vacancies')->group(function () {
            Route::get('vacancies/create', [AdminVacancyController::class, 'create'])->name('vacancies.create');
            Route::post('vacancies', [AdminVacancyController::class, 'store'])->name('vacancies.store');
        });
        Route::middleware('permission:update vacancies')->group(function () {
            Route::get('vacancies/{vacancy}/edit', [AdminVacancyController::class, 'edit'])->name('vacancies.edit');
            Route::put('vacancies/{vacancy}', [AdminVacancyController::class, 'update'])->name('vacancies.update');
            Route::post('vacancies/{vacancy}/close', [AdminVacancyController::class, 'close'])->name('vacancies.close');
            Route::post('vacancies/{vacancy}/cancel', [AdminVacancyController::class, 'cancel'])->name('vacancies.cancel');
            Route::delete('vacancies/{vacancy}', [AdminVacancyController::class, 'destroy'])->name('vacancies.destroy');
        });
        Route::post('vacancies/{vacancy}/publish', [AdminVacancyController::class, 'publish'])
            ->middleware('permission:publish vacancies')->name('vacancies.publish');

        Route::middleware('permission:review applications')->group(function () {
            Route::get('applications', [AdminApplicationController::class, 'index'])->name('applications.index');
            Route::get('applications/{application}', [AdminApplicationController::class, 'show'])->name('applications.show');
        });
        Route::post('applications/{application}/screening', [AdminApplicationController::class, 'screen'])
            ->middleware('permission:screen applications')->name('applications.screen');
        Route::post('applications/{application}/shortlist', [AdminApplicationController::class, 'shortlist'])
            ->middleware('permission:shortlist applicants')->name('applications.shortlist');
        Route::post('applications/{application}/decision', [RecruitmentDecisionController::class, 'store'])
            ->middleware('permission:manage recruitment decisions')->name('applications.decision');

        Route::get('interviews/create', [InterviewController::class, 'create'])
            ->middleware('permission:schedule interviews')->name('interviews.create');
        Route::post('interviews', [InterviewController::class, 'store'])
            ->middleware('permission:schedule interviews')->name('interviews.store');
        Route::put('interviews/{interview}/panel', [InterviewController::class, 'updatePanel'])
            ->middleware('permission:manage interview panels')->name('interviews.panel.update');
        Route::patch('interviews/{interview}/reschedule', [InterviewController::class, 'reschedule'])
            ->middleware('permission:manage interview panels')->name('interviews.reschedule');
        Route::post('interviews/{interview}/cancel', [InterviewController::class, 'cancel'])
            ->middleware('permission:manage interview panels')->name('interviews.cancel');

        Route::get('reports', [ReportController::class, 'index'])->middleware('permission:view reports')->name('reports.index');
        Route::get('reports/export', [ReportController::class, 'export'])->middleware('permission:view reports')->name('reports.export');
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->middleware('permission:view activity logs')->name('activity-logs.index');
    });

    Route::middleware('permission:view assigned interviews|manage interview panels')->group(function () {
        Route::get('interviews', [InterviewController::class, 'index'])->name('interviews.index');
        Route::get('interviews/{interview}', [InterviewController::class, 'show'])->name('interviews.show');
    });
    Route::get('interviews/{interview}/evaluation', [InterviewEvaluationController::class, 'create'])
        ->middleware('permission:evaluate candidates')->name('interviews.evaluation.create');
    Route::post('interviews/{interview}/evaluation', [InterviewEvaluationController::class, 'store'])
        ->middleware('permission:evaluate candidates')->name('interviews.evaluation.store');
});

require __DIR__.'/settings.php';
