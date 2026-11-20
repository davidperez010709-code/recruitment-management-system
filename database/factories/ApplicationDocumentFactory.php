<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\ApplicationDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ApplicationDocument> */
class ApplicationDocumentFactory extends Factory
{
    protected $model = ApplicationDocument::class;

    public function definition(): array
    {
        return [
            'application_id' => Application::factory(),
            'document_type' => 'cv',
            'document_name' => 'candidate-cv.pdf',
            'file_path' => 'application-documents/demo/candidate-cv.pdf',
            'mime_type' => 'application/pdf',
            'file_size' => 1024,
        ];
    }
}
