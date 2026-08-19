<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user && $request->filled('user_id')) {
            $user = User::find($request->input('user_id'));

            if ($user) {
                $request->setUserResolver(fn () => $user);
            }
        }

        if (!$user) {
            return response()->json([
                'message' => 'Debes iniciar sesión para realizar esta acción.',
            ], 401);
        }

        if (count($roles) > 0) {
            $rolUsuario = $user->esLider() ? 'lider' : 'estudiante';

            if (!in_array($rolUsuario, $roles, true)) {
                return response()->json([
                    'message' => 'No tienes permiso para realizar esta acción.',
                ], 403);
            }
        }

        return $next($request);
    }
}
