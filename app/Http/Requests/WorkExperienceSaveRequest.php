<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class WorkExperienceSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage own profile') ?? false;
    }

    public function rules(): array
    {
        return [
            'organization' => ['required', 'string', 'max:200'],
            'job_title' => ['required', 'string', 'max:150'],
            'employment_type' => ['nullable', 'string', 'max:80'],
            'start_date' => ['required', 'date', 'before_or_equal:today'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'responsibilities' => ['nullable', 'string', 'max:5000'],
            'is_current' => ['sometimes', 'boolean'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($this->boolean('is_current') && $this->filled('end_date')) {
                $validator->errors()->add('end_date', 'Current roles cannot have an end date.');
            }
        }];
    }
}
