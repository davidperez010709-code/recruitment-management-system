<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RoleSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage roles') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:80', 'regex:/^[A-Z][A-Z0-9_]*$/', Rule::unique('roles', 'name')->where('guard_name', 'web')->ignore($this->route('role'))],
            'permissions' => ['sometimes', 'array'],
            'permissions.*' => ['string', 'distinct', 'exists:permissions,name'],
        ];
    }
}
