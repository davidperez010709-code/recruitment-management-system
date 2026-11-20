<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacancy_id')->constrained()->restrictOnDelete();
            $table->foreignId('applicant_user_id')->constrained('users')->restrictOnDelete();
            $table->string('application_number')->unique();
            $table->text('cover_letter')->nullable();
            $table->string('status', 32)->default('SUBMITTED');
            $table->timestamp('submitted_at');
            $table->timestamps();
            $table->unique(['vacancy_id', 'applicant_user_id']);
            $table->index(['status', 'submitted_at']);
            $table->index(['applicant_user_id', 'status']);
        });

        Schema::create('application_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->string('document_type');
            $table->string('document_name');
            $table->string('file_path');
            $table->string('mime_type', 150);
            $table->unsignedBigInteger('file_size');
            $table->timestamps();
            $table->index(['application_id', 'document_type']);
        });

        Schema::create('application_screenings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('screened_by')->constrained('users')->restrictOnDelete();
            $table->decimal('screening_score', 5, 2)->nullable();
            $table->text('remarks')->nullable();
            $table->string('result', 24)->default('PENDING');
            $table->timestamp('screened_at')->nullable();
            $table->timestamps();
            $table->index(['application_id', 'screened_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_screenings');
        Schema::dropIfExists('application_documents');
        Schema::dropIfExists('applications');
    }
};
