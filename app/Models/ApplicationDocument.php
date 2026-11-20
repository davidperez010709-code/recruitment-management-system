<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApplicationDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'document_type',
        'document_name',
        'file_path',
        'mime_type',
        'file_size',
    ];

    protected function casts(): array
    {
        return ['file_size' => 'integer'];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}
