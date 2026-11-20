<?php

namespace App\Models;

use App\Enums\RecruitmentDecisionType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecruitmentDecision extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'decided_by',
        'decision',
        'remarks',
        'decision_date',
    ];

    protected function casts(): array
    {
        return [
            'decision' => RecruitmentDecisionType::class,
            'decision_date' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function decisionMaker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'decided_by');
    }
}
