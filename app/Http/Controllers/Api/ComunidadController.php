<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreComunidadRequest;
use App\Http\Requests\UpdateComunidadRequest;
use App\Models\Comunidad;
use App\Models\Membresia;
use Illuminate\Http\Request;

// Desarrollado por Milena Pazmiño
// Requerimientos: Registrar comunidad (escritura) y Explorar catálogo de comunidades (lectura)
class ComunidadController extends Controller
{
    // GET /api/comunidades
    public function index(Request $request){
        $query = Comunidad::where('activa', true);

        if ($request->filled('categoria')) {
            $query->where('categoria', $request->categoria);
        }

        if ($request->filled('facultad')) {
            $query->where('facultad', $request->facultad);
        }

        if ($request->filled('nombre')) {
            $query->where('nombre', 'like', '%' . $request->nombre . '%');
        }

        $comunidades = $query->orderBy('nombre')->get();

        return response()->json([
            'total' => $comunidades->count(),
            'data'  => $comunidades,
        ]);
    }

    // GET /api/comunidades/{id}
    public function show($id){
        $comunidad = Comunidad::withCount([
            'membresias as miembros_count' => function ($query) {
                $query->where('estado', 'aprobada');
            },
        ])->findOrFail($id);

        return response()->json([
            'data' => $comunidad,
        ]);
    }

    // POST /api/comunidades
    public function store(StoreComunidadRequest $request){
        $comunidad = Comunidad::create([
            'nombre'          => $request->nombre,
            'categoria'       => $request->categoria,
            'facultad'        => $request->facultad,
            'descripcion'     => $request->descripcion,
            'mision'          => $request->mision,
            'logo_url'        => $request->logo_url,
            'correo_contacto' => $request->correo_contacto,
            'instagram'       => $request->instagram,
            'fecha_fundacion' => $request->fecha_fundacion,
            'activa'          => true,
        ]);

        // Quien registra la comunidad queda como su líder (presidente), aprobado de inmediato.
        Membresia::create([
            'user_id'      => $request->user()->id,
            'comunidad_id' => $comunidad->id,
            'rol'          => 'presidente',
            'estado'       => 'aprobada',
            'fecha_ingreso' => now()->toDateString(),
        ]);

        return response()->json([
            'message' => 'Comunidad registrada correctamente.',
            'data'    => $comunidad,
        ], 201);
    }

    // PUT /api/comunidades/{id}
    public function update(UpdateComunidadRequest $request, $id){
        $comunidad = Comunidad::findOrFail($id);

        $esLider = Membresia::where('comunidad_id', $comunidad->id)
            ->where('user_id', $request->user()->id)
            ->where('rol', 'presidente')
            ->where('estado', 'aprobada')
            ->exists();

        if (!$esLider) {
            return response()->json([
                'message' => 'Solo el líder de la comunidad puede editarla.',
            ], 403);
        }

        $comunidad->fill($request->only([
            'nombre', 'categoria', 'facultad', 'descripcion', 'mision',
            'logo_url', 'correo_contacto', 'instagram', 'fecha_fundacion', 'activa',
        ]));
        $comunidad->save();

        return response()->json([
            'message' => 'Comunidad actualizada correctamente.',
            'data'    => $comunidad,
        ]);
    }
}
