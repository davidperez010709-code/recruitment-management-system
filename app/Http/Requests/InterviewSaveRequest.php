<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InterviewSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('schedule interviews') ?? false;
    }

    public function rules(): array
    {
        return [
            'application_id' => ['required', 'integer', 'exists:applications,id'],
            'interview_type' => ['required', 'string', 'max:80'],
            'interview_date' => ['required', 'date', 'after:now'],
            'location' => ['nullable', 'string', 'max:200'],
            'instructions' => ['nullable', 'string', 'max:5000'],
            'panel_member_ids' => ['required', 'array', 'min:1', 'max:20'],
            'panel_member_ids.*' => ['required', 'integer', 'distinct', 'exists:users,id'],
        ];
    }
}
