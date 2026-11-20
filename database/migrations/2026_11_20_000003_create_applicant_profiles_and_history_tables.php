<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applicant_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->date('date_of_birth')->nullable();
            $table->string('gender')->nullable();
            $table->text('address')->nullable();
            $table->string('state_of_origin')->nullable();
            $table->string('nationality')->default('Nigerian');
            $table->string('profile_photo')->nullable();
            $table->timestamps();
        });

        Schema::create('qualifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->cascadeOnDelete();
            $table->string('institution_name');
            $table->string('qualification');
            $table->string('field_of_study');
            $table->string('grade')->nullable();
            $table->unsignedSmallInteger('graduation_year');
            $table->timestamps();
            $table->index(['applicant_profile_id', 'graduation_year']);
        });

        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('applicant_profile_id')->constrained()->cascadeOnDelete();
            $table->string('organization');
            $table->string('job_title');
            $table->string('employment_type')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->text('responsibilities')->nullable();
            $table->boolean('is_current')->default(false);
            $table->timestamps();
            $table->index(['applicant_profile_id', 'start_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_experiences');
        Schema::dropIfExists('qualifications');
        Schema::dropIfExists('applicant_profiles');
    }
};
