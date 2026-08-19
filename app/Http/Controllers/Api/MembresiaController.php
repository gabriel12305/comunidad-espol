<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSolicitudRequest;
use App\Models\Comunidad;
use App\Models\Membresia;
use Illuminate\Http\Request;

class MembresiaController extends Controller
{
    // POST /api/comunidades/{comunidadId}/solicitudes
    public function solicitar(StoreSolicitudRequest $request, $comunidadId){
        $comunidad = Comunidad::findOrFail($comunidadId);
        $userId = $request->user()->id;

        $yaExiste = Membresia::where('user_id', $userId)
            ->where('comunidad_id', $comunidad->id)
            ->exists();

        if ($yaExiste) {
            return response()->json([
                'message' => 'Ya existe una solicitud o membresía para esta comunidad.',
            ], 409);
        }

        $membresia = Membresia::create([
            'user_id'      => $userId,
            'comunidad_id' => $comunidad->id,
            'rol'          => 'miembro',
            'estado'       => 'pendiente',
        ]);

        return response()->json([
            'message' => 'Solicitud enviada correctamente.',
            'data'    => $membresia->load('user:id,name,matricula', 'comunidad:id,nombre'),
        ], 201);
    }

    public function resolver(Request $request, $id){
        $datos = $request->validate([
            'estado' => 'required|in:aprobada,rechazada',
        ]);

        $membresia = Membresia::findOrFail($id);

        $esLider = Membresia::where('comunidad_id', $membresia->comunidad_id)
            ->where('user_id', $request->user()->id)
            ->where('rol', 'presidente')
            ->where('estado', 'aprobada')
            ->exists();

        if (!$esLider) {
            return response()->json([
                'message' => 'Solo el líder de la comunidad puede resolver esta solicitud.',
            ], 403);
        }

        if ($membresia->estado !== 'pendiente') {
            return response()->json([
                'message'       => 'Esta solicitud ya fue resuelta.',
                'estado_actual' => $membresia->estado,
            ], 409);
        }

        $membresia->estado = $datos['estado'];
        $membresia->fecha_ingreso = $datos['estado'] === 'aprobada'
            ? now()->toDateString()
            : null;
        $membresia->save();

        return response()->json([
            'message' => "Solicitud {$membresia->estado} correctamente.",
            'data'    => $membresia->load('user:id,name,matricula'),
        ]);
    }

    // GET /api/comunidades/{comunidadId}/miembros
    public function padron(Request $request, $comunidadId){
        $comunidad = Comunidad::findOrFail($comunidadId);

        $query = Membresia::where('comunidad_id', $comunidad->id)
            ->with('user:id,name,email,matricula');

        if ($request->filled('estado')) {
            $query->where('estado', $request->estado);
        }

        if ($request->filled('rol')) {
            $query->where('rol', $request->rol);
        }

        $miembros = $query->orderBy('fecha_ingreso')->get();

        return response()->json([
            'comunidad' => $comunidad->nombre,
            'total'     => $miembros->count(),
            'data'      => $miembros,
        ]);
    }
}
