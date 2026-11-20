<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicantProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date_of_birth',
        'gender',
        'address',
        'state_of_origin',
        'nationality',
        'profile_photo',
    ];

    protected function casts(): array
    {
        return ['date_of_birth' => 'date'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function qualifications(): HasMany
    {
        return $this->hasMany(Qualification::class);
    }

    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class);
    }
}
