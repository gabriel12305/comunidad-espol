<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comunidad extends Model
{
    protected $table = 'comunidades';

    protected $fillable = [
        'nombre', 'categoria', 'facultad', 'descripcion', 'mision',
        'logo_url', 'correo_contacto', 'instagram', 'fecha_fundacion', 'activa',
    ];

    protected $casts = [
        'activa'          => 'boolean',
        'fecha_fundacion' => 'date:Y-m-d',
    ];

    public function membresias()
    {
        return $this->hasMany(Membresia::class);
    }

    public function actividades()
    {
        return $this->hasMany(Actividad::class);
    }
}
