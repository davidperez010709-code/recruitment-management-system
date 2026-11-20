<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplicationSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('submit applications') ?? false;
    }

    public function rules(): array
    {
        return [
            'cover_letter' => ['nullable', 'string', 'max:10000'],
            'documents' => ['sometimes', 'array', 'max:12'],
            'documents.*.type' => ['required_with:documents', 'string', 'in:cv,cover_letter,qualification,identity,other'],
            'documents.*.file' => ['required_with:documents', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ];
    }
}
