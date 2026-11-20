<?php

namespace App\Http\Requests;

use App\Enums\RecruitmentDecisionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RecruitmentDecisionSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage recruitment decisions') ?? false;
    }

    public function rules(): array
    {
        return [
            'decision' => ['required', Rule::enum(RecruitmentDecisionType::class)],
            'remarks' => ['nullable', 'string', 'max:10000'],
        ];
    }
}
