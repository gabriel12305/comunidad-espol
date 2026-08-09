<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Membresia extends Model
{
    protected $table = 'membresias';

    protected $fillable = [
        'user_id', 'comunidad_id', 'rol', 'estado', 'fecha_ingreso',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function comunidad()
    {
        return $this->belongsTo(Comunidad::class);
    }
}
