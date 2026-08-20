<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MembresiaController;
use App\Http\Controllers\Api\ComunidadController;
use App\Http\Controllers\Api\ActividadController;

// ===== Autenticación =====
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/user', [AuthController::class, 'user'])->middleware('auth:sanctum');




// ===== Membresías — Gabriel =====
Route::post('/comunidades/{comunidadId}/solicitudes', [MembresiaController::class, 'solicitar'])
    ->middleware('role'); // cualquier usuario identificado puede solicitar ingreso
Route::patch('/solicitudes/{id}', [MembresiaController::class, 'resolver'])
    ->middleware('role:lider'); // solo un líder resuelve solicitudes
Route::get('/comunidades/{comunidadId}/miembros', [MembresiaController::class, 'padron'])
    ->middleware('role'); // padrón visible para cualquier usuario identificado






// ===== Comunidades — Milena =====
Route::get('/comunidades', [ComunidadController::class, 'index']);
Route::get('/comunidades/{id}', [ComunidadController::class, 'show']);
Route::post('/comunidades', [ComunidadController::class, 'store'])
    ->middleware('role'); // cualquier usuario identificado puede fundar una comunidad
Route::put('/comunidades/{id}', [ComunidadController::class, 'update'])
    ->middleware('role:lider'); // solo un líder edita (el controlador valida cuál comunidad)










// ===== Actividades — Carla =====
Route::post('/comunidades/{comunidadId}/actividades', [ActividadController::class, 'store'])
    ->middleware('role:lider'); // solo el líder registra actividades de su comunidad
Route::get('/comunidades/{comunidadId}/actividades', [ActividadController::class, 'historial']);
