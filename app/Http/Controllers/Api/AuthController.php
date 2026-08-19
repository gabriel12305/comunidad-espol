<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // POST /api/login
    public function login(Request $request)
    {
        $credenciales = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required'    => 'El correo es obligatorio.',
            'email.email'       => 'El correo no es válido.',
            'password.required' => 'La contraseña es obligatoria.',
        ]);

        if (!Auth::attempt($credenciales)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales no coinciden con nuestros registros.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Sesión iniciada correctamente.',
            'data'    => $this->serializarUsuario($request->user()),
        ]);
    }

    // POST /api/logout
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Sesión cerrada correctamente.',
        ]);
    }

    // GET /api/user
    public function user(Request $request)
    {
        return response()->json([
            'data' => $this->serializarUsuario($request->user()),
        ]);
    }

    private function serializarUsuario(User $user): array
    {
        return [
            'id'                    => $user->id,
            'name'                  => $user->name,
            'email'                 => $user->email,
            'matricula'             => $user->matricula,
            'rol_principal'         => $user->esLider() ? 'lider' : 'estudiante',
            'comunidades_lideradas' => $user->comunidadesQueLidera()
                ->map(fn ($comunidad) => [
                    'id'     => $comunidad->id,
                    'nombre' => $comunidad->nombre,
                ])
                ->values(),
        ];
    }
}
