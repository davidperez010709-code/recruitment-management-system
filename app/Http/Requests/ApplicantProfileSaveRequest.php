<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ApplicantProfileSaveRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage own profile') ?? false;
    }

    public function rules(): array
    {
        return [
            'phone' => ['nullable', 'string', 'max:40'],
            'date_of_birth' => ['nullable', 'date', 'before:today'],
            'gender' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:2000'],
            'state_of_origin' => ['nullable', 'string', 'max:100'],
            'nationality' => ['required', 'string', 'max:100'],
            'profile_photo' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
