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
        Schema::create('comunidades', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('categoria');
            $table->string('facultad');
            $table->text('descripcion');
            $table->text('mision')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('correo_contacto')->nullable();
            $table->string('instagram')->nullable();
            $table->date('fecha_fundacion')->nullable();
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comunidades');
    }
};
