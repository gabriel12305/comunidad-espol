<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\MembresiaController;

// ===== Membresías — Gabriel =====
Route::post('/comunidades/{comunidadId}/solicitudes', [MembresiaController::class, 'solicitar']);
Route::patch('/solicitudes/{id}', [MembresiaController::class, 'resolver']);
Route::get('/comunidades/{comunidadId}/miembros', [MembresiaController::class, 'padron']);








// ===== Milena =====













// ===== Carla =====














