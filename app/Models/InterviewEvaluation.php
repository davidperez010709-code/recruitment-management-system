<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterviewEvaluation extends Model
{
    use HasFactory;

    protected $fillable = [
        'interview_id',
        'evaluator_id',
        'technical_score',
        'communication_score',
        'experience_score',
        'overall_score',
        'comments',
        'recommendation',
    ];

    protected function casts(): array
    {
        return [
            'technical_score' => 'decimal:2',
            'communication_score' => 'decimal:2',
            'experience_score' => 'decimal:2',
            'overall_score' => 'decimal:2',
        ];
    }

    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }

    public function evaluator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'evaluator_id');
    }
}
