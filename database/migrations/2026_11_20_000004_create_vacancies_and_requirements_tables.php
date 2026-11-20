<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->restrictOnDelete();
            $table->foreignId('created_by')->constrained('users')->restrictOnDelete();
            $table->string('title');
            $table->string('reference_number')->unique();
            $table->text('description');
            $table->string('job_type');
            $table->string('employment_category');
            $table->string('location');
            $table->unsignedInteger('number_of_positions')->default(1);
            $table->string('minimum_qualification');
            $table->text('experience_required')->nullable();
            $table->string('salary_range')->nullable();
            $table->date('application_deadline');
            $table->string('status', 24)->default('DRAFT');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'application_deadline']);
            $table->index(['department_id', 'status']);
        });

        Schema::create('vacancy_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->cascadeOnDelete();
            $table->text('requirement');
            $table->string('requirement_type');
            $table->boolean('is_mandatory')->default(true);
            $table->timestamps();
            $table->index(['vacancy_id', 'is_mandatory']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacancy_requirements');
        Schema::dropIfExists('vacancies');
    }
};
