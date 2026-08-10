<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Desarrollado por Carla Gutiérrez
class StoreActividadRequest extends FormRequest
{
    public function authorize(): bool{
        return true;
    }

    public function rules(): array{
        return [
            'user_id'     => 'required|exists:users,id',
            'titulo'      => 'required|string|max:150',
            'tipo'        => 'required|string|max:50',
            'fecha'       => 'required|date',
            'lugar'       => 'required|string|max:150',
            'descripcion' => 'nullable|string',
        ];
    }

    public function messages(): array{
        return [
            'user_id.required'  => 'Debe indicar el usuario que registra la actividad.',
            'user_id.exists'    => 'El usuario indicado no existe.',
            'titulo.required'   => 'El título de la actividad es obligatorio.',
            'tipo.required'     => 'Debe indicar el tipo de actividad.',
            'fecha.required'    => 'Debe indicar la fecha de la actividad.',
            'fecha.date'        => 'La fecha indicada no es válida.',
            'lugar.required'    => 'Debe indicar el lugar de la actividad.',
        ];
    }
}
