<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreActividadRequest;
use App\Models\Actividad;
use App\Models\Comunidad;
use App\Models\Membresia;
use Illuminate\Http\Request;

// Desarrollado por Carla Gutiérrez
class ActividadController extends Controller
{
    // POST /api/comunidades/{comunidadId}/actividades
    public function store(StoreActividadRequest $request, $comunidadId){
        $comunidad = Comunidad::findOrFail($comunidadId);

        $esLider = Membresia::where('comunidad_id', $comunidad->id)
            ->where('user_id', $request->user()->id)
            ->where('rol', 'presidente')
            ->where('estado', 'aprobada')
            ->exists();

        if (!$esLider) {
            return response()->json([
                'message' => 'Solo el líder de la comunidad puede registrar actividades.',
            ], 403);
        }

        $actividad = Actividad::create([
            'comunidad_id' => $comunidad->id,
            'titulo'       => $request->titulo,
            'tipo'         => $request->tipo,
            'fecha'        => $request->fecha,
            'lugar'        => $request->lugar,
            'descripcion'  => $request->descripcion,
        ]);

        return response()->json([
            'message' => 'Actividad registrada correctamente.',
            'data'    => $actividad->load('comunidad:id,nombre'),
        ], 201);
    }

    // GET /api/comunidades/{comunidadId}/actividades
    public function historial(Request $request, $comunidadId){
        $comunidad = Comunidad::findOrFail($comunidadId);

        $query = Actividad::where('comunidad_id', $comunidad->id)
            ->with('comunidad:id,nombre');

        if ($request->filled('tipo')) {
            $query->where('tipo', $request->tipo);
        }

        if ($request->filled('periodo')) {
            $hoy = now()->toDateString();

            if ($request->periodo === 'proximas') {
                $query->where('fecha', '>=', $hoy);
            } elseif ($request->periodo === 'pasadas') {
                $query->where('fecha', '<', $hoy);
            }
        }

        $actividades = $query->orderBy('fecha')->get();

        return response()->json([
            'comunidad' => $comunidad->nombre,
            'total'     => $actividades->count(),
            'data'      => $actividades,
        ]);
    }
}
