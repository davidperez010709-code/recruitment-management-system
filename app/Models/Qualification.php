<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Qualification extends Model
{
    use HasFactory;

    protected $fillable = [
        'applicant_profile_id',
        'institution_name',
        'qualification',
        'field_of_study',
        'grade',
        'graduation_year',
    ];

    protected function casts(): array
    {
        return ['graduation_year' => 'integer'];
    }

    public function applicantProfile(): BelongsTo
    {
        return $this->belongsTo(ApplicantProfile::class);
    }
}
