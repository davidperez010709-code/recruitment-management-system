<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DepartmentSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage departments') ?? false;
    }

    public function rules(): array
    {
        $department = $this->route('department');

        return [
            'name' => ['required', 'string', 'max:150'],
            'code' => ['required', 'string', 'max:20', Rule::unique('departments', 'code')->ignore($department)],
            'description' => ['nullable', 'string', 'max:5000'],
            'head_of_department' => ['nullable', 'string', 'max:150'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
