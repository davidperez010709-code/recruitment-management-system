<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VacancyRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'vacancy_id',
        'requirement',
        'requirement_type',
        'is_mandatory',
    ];

    protected function casts(): array
    {
        return ['is_mandatory' => 'boolean'];
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }
}
