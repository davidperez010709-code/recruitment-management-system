<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PermissionSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage permissions') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z][a-z0-9 ]*$/',
                Rule::unique('permissions', 'name')->where('guard_name', 'web')->ignore($this->route('permission')),
            ],
        ];
    }
}
