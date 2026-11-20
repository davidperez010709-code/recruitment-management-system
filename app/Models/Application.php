<?php

namespace App\Models;

use App\Enums\ApplicationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'vacancy_id',
        'applicant_user_id',
        'application_number',
        'cover_letter',
        'status',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => ApplicationStatus::class,
            'submitted_at' => 'datetime',
        ];
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function applicant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applicant_user_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ApplicationDocument::class);
    }

    public function screenings(): HasMany
    {
        return $this->hasMany(ApplicationScreening::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function recruitmentDecision(): HasOne
    {
        return $this->hasOne(RecruitmentDecision::class);
    }
}
