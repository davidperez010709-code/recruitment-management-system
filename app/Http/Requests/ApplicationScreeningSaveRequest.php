<?php

namespace App\Http\Requests;

use App\Enums\ScreeningResult;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ApplicationScreeningSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('screen applications') ?? false;
    }

    public function rules(): array
    {
        return [
            'screening_score' => ['nullable', 'numeric', 'between:0,100'],
            'remarks' => ['nullable', 'string', 'max:5000'],
            'result' => ['required', Rule::enum(ScreeningResult::class)],
        ];
    }
}
