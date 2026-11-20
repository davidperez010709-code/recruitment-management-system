<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QualificationSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage own profile') ?? false;
    }

    public function rules(): array
    {
        return [
            'institution_name' => ['required', 'string', 'max:200'],
            'qualification' => ['required', 'string', 'max:150'],
            'field_of_study' => ['required', 'string', 'max:150'],
            'grade' => ['nullable', 'string', 'max:80'],
            'graduation_year' => ['required', 'integer', 'between:1950,'.(now()->year + 10)],
        ];
    }
}
