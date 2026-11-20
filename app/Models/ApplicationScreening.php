<?php

namespace App\Models;

use App\Enums\ScreeningResult;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationScreening extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'screened_by',
        'screening_score',
        'remarks',
        'result',
        'screened_at',
    ];

    protected function casts(): array
    {
        return [
            'screening_score' => 'decimal:2',
            'result' => ScreeningResult::class,
            'screened_at' => 'datetime',
        ];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    public function screener(): BelongsTo
    {
        return $this->belongsTo(User::class, 'screened_by');
    }
}
