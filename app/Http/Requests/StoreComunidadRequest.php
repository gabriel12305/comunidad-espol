<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreComunidadRequest extends FormRequest
{
    public function authorize(): bool{
        return true;
    }

    public function rules(): array{
        return [
            'user_id'         => 'required|exists:users,id',
            'nombre'          => 'required|string|max:150|unique:comunidades,nombre',
            'categoria'       => 'required|string|max:50',
            'facultad'        => 'required|string|max:50',
            'descripcion'     => 'required|string',
            'mision'          => 'nullable|string',
            'logo_url'        => 'nullable|url|max:255',
            'correo_contacto' => 'nullable|email|max:150',
            'instagram'       => 'nullable|string|max:100',
            'fecha_fundacion' => 'nullable|date',
        ];
    }

    public function messages(): array{
        return [
            'user_id.required'  => 'Debe indicar el usuario que crea la comunidad.',
            'user_id.exists'    => 'El usuario indicado no existe.',
            'nombre.required'   => 'El nombre de la comunidad es obligatorio.',
            'nombre.unique'     => 'Ya existe una comunidad registrada con ese nombre.',
            'categoria.required' => 'Debe indicar la categoría de la comunidad.',
            'facultad.required' => 'Debe indicar la facultad de la comunidad.',
            'descripcion.required' => 'Debe indicar una descripción de la comunidad.',
            'logo_url.url'       => 'El logo debe ser una URL válida.',
            'correo_contacto.email' => 'El correo de contacto no es válido.',
        ];
    }
}
