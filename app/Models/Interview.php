<?php

namespace App\Models;

use App\Enums\InterviewStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'interview_type',
        'interview_date',
        'location',
        'instructions',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'interview_date' => 'datetime',
            'status' => InterviewStatus::class,
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function panelMembers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'interview_panel_members')->withTimestamps();
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(InterviewEvaluation::class);
    }
}
