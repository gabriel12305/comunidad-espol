<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Desarrollado por Milena Pazmiño
class UpdateComunidadRequest extends FormRequest
{
    public function authorize(): bool{
        return true;
    }

    public function rules(): array{
        $comunidadId = $this->route('id');

        return [
            'user_id'         => 'required|exists:users,id',
            'nombre'          => [
                'sometimes', 'required', 'string', 'max:150',
                Rule::unique('comunidades', 'nombre')->ignore($comunidadId),
            ],
            'categoria'       => 'sometimes|required|string|max:50',
            'facultad'        => 'sometimes|required|string|max:50',
            'descripcion'     => 'sometimes|required|string',
            'mision'          => 'nullable|string',
            'logo_url'        => 'nullable|url|max:255',
            'correo_contacto' => 'nullable|email|max:150',
            'instagram'       => 'nullable|string|max:100',
            'fecha_fundacion' => 'nullable|date',
            'activa'          => 'sometimes|boolean',
        ];
    }

    public function messages(): array{
        return [
            'user_id.required'  => 'Debe indicar el usuario que edita la comunidad.',
            'user_id.exists'    => 'El usuario indicado no existe.',
            'nombre.required'   => 'El nombre de la comunidad es obligatorio.',
            'nombre.unique'     => 'Ya existe una comunidad registrada con ese nombre.',
            'logo_url.url'       => 'El logo debe ser una URL válida.',
            'correo_contacto.email' => 'El correo de contacto no es válido.',
        ];
    }
}
