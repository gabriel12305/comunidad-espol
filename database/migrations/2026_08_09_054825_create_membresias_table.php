<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('membresias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('comunidad_id')->constrained('comunidades')->onDelete('cascade');
            $table->string('rol')->default('miembro');
            $table->string('estado')->default('pendiente'); // pendiente, aprobada, rechazada
            $table->date('fecha_ingreso')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'comunidad_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membresias');
    }
};
