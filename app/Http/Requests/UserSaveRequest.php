<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage users') ?? false;
    }

    public function rules(): array
    {
        $user = $this->route('user');

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user)],
            'phone' => ['nullable', 'string', 'max:40'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'is_active' => ['sometimes', 'boolean'],
            'password' => [$user ? 'nullable' : 'required', 'string', 'min:12'],
            'roles' => ['sometimes', 'array'],
            'roles.*' => ['string', 'distinct', 'exists:roles,name'],
        ];
    }
}
