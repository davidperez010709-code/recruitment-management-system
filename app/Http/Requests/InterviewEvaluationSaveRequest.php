<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InterviewEvaluationSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('evaluate candidates') ?? false;
    }

    public function rules(): array
    {
        return [
            'technical_score' => ['required', 'numeric', 'between:0,100'],
            'communication_score' => ['required', 'numeric', 'between:0,100'],
            'experience_score' => ['required', 'numeric', 'between:0,100'],
            'comments' => ['nullable', 'string', 'max:10000'],
            'recommendation' => ['required', 'string', 'in:STRONGLY_RECOMMEND,RECOMMEND,RESERVE,DO_NOT_RECOMMEND'],
        ];
    }
}
