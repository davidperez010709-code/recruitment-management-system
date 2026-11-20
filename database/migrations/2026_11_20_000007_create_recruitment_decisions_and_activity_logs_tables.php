<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recruitment_decisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->unique()->constrained()->restrictOnDelete();
            $table->foreignId('decided_by')->constrained('users')->restrictOnDelete();
            $table->string('decision', 24);
            $table->text('remarks')->nullable();
            $table->dateTime('decision_date');
            $table->timestamps();
            $table->index(['decision', 'decision_date']);
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->text('description');
            $table->nullableMorphs('subject');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('recruitment_decisions');
    }
};
