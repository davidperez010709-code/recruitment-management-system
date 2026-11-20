<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkExperience extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_profile_id',
        'organization',
        'job_title',
        'employment_type',
        'start_date',
        'end_date',
        'responsibilities',
        'is_current',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
        ];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}
