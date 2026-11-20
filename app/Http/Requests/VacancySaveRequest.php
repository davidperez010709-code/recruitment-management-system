<?php

namespace App\Http\Requests;

use App\Enums\EmploymentCategory;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VacancySaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        return $this->route('vacancy')
            ? (bool) $user?->can('update vacancies')
            : (bool) $user?->can('create vacancies');
    }

    public function rules(): array
    {
        $vacancy = $this->route('vacancy');

        return [
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'title' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string', 'max:20000'],
            'job_type' => ['required', 'string', 'max:80'],
            'employment_category' => ['required', Rule::enum(EmploymentCategory::class)],
            'location' => ['required', 'string', 'max:180'],
            'number_of_positions' => ['required', 'integer', 'min:1', 'max:1000'],
            'minimum_qualification' => ['required', 'string', 'max:180'],
            'experience_required' => ['nullable', 'string', 'max:5000'],
            'salary_range' => ['nullable', 'string', 'max:120'],
            'application_deadline' => ['required', 'date', 'after_or_equal:today'],
            'requirements' => ['sometimes', 'array', 'max:40'],
            'requirements.*.requirement' => ['required_with:requirements', 'string', 'max:2000'],
            'requirements.*.requirement_type' => ['required_with:requirements', 'string', 'max:80'],
            'requirements.*.is_mandatory' => ['sometimes', 'boolean'],
        ];
    }
}
