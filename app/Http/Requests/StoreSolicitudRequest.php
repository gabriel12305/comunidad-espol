<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSolicitudRequest extends FormRequest
{
    public function authorize(): bool{
        return true;
    }

    public function rules(): array{
        return [
            'user_id' => 'nullable|exists:users,id',
        ];
    }

    public function messages(): array{
        return [
            'user_id.exists' => 'El estudiante indicado no existe.',
        ];
    }
}
