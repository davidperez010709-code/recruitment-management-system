<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InterviewRescheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage interview panels') ?? false;
    }

    public function rules(): array
    {
        return [
            'interview_date' => ['required', 'date', 'after:now'],
            'location' => ['nullable', 'string', 'max:200'],
            'instructions' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
