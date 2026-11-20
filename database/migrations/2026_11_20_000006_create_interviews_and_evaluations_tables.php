<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->restrictOnDelete();
            $table->string('interview_type');
            $table->dateTime('interview_date');
            $table->string('location')->nullable();
            $table->text('instructions')->nullable();
            $table->string('status', 24)->default('SCHEDULED');
            $table->timestamps();
            $table->index(['status', 'interview_date']);
        });

        Schema::create('interview_panel_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interview_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->timestamps();
            $table->unique(['interview_id', 'user_id']);
            $table->index('user_id');
        });

        Schema::create('interview_evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('interview_id')->constrained()->cascadeOnDelete();
            $table->foreignId('evaluator_id')->constrained('users')->restrictOnDelete();
            $table->decimal('technical_score', 5, 2);
            $table->decimal('communication_score', 5, 2);
            $table->decimal('experience_score', 5, 2);
            $table->decimal('overall_score', 5, 2);
            $table->text('comments')->nullable();
            $table->string('recommendation');
            $table->timestamps();
            $table->unique(['interview_id', 'evaluator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interview_evaluations');
        Schema::dropIfExists('interview_panel_members');
        Schema::dropIfExists('interviews');
    }
};
