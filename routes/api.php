<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\MembresiaController;
use App\Http\Controllers\Api\ComunidadController;

// ===== Membresías — Gabriel =====
Route::post('/comunidades/{comunidadId}/solicitudes', [MembresiaController::class, 'solicitar']);
Route::patch('/solicitudes/{id}', [MembresiaController::class, 'resolver']);
Route::get('/comunidades/{comunidadId}/miembros', [MembresiaController::class, 'padron']);








// ===== Comunidades — Milena =====
Route::get('/comunidades', [ComunidadController::class, 'index']);
Route::get('/comunidades/{id}', [ComunidadController::class, 'show']);
Route::post('/comunidades', [ComunidadController::class, 'store']);
Route::put('/comunidades/{id}', [ComunidadController::class, 'update']);












// ===== Carla =====














