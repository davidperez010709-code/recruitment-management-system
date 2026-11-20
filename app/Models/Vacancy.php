<?php

namespace App\Models;

use App\Enums\EmploymentCategory;
use App\Enums\VacancyStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'department_id',
        'created_by',
        'title',
        'reference_number',
        'description',
        'job_type',
        'employment_category',
        'location',
        'number_of_positions',
        'minimum_qualification',
        'experience_required',
        'salary_range',
        'application_deadline',
        'status',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => VacancyStatus::class,
            'employment_category' => EmploymentCategory::class,
            'application_deadline' => 'date',
            'published_at' => 'datetime',
            'number_of_positions' => 'integer',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function requirements(): HasMany
    {
        return $this->hasMany(VacancyRequirement::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
