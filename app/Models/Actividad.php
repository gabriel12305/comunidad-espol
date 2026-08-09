<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    protected $table = 'actividades';

    protected $fillable = [
        'comunidad_id', 'titulo', 'tipo', 'fecha', 'lugar', 'descripcion',
    ];

    public function comunidad()
    {
        return $this->belongsTo(Comunidad::class);
    }
}
