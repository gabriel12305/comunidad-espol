<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Comunidad;
use App\Models\Membresia;
use App\Models\Actividad;

class DatosPruebaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ana = User::create(['name' => 'Ana Torres', 'email' => 'ana@espol.edu.ec', 'matricula' => '202201001', 'password' => bcrypt('password')]);
        $luis = User::create(['name' => 'Luis Mora', 'email' => 'luis@espol.edu.ec', 'matricula' => '202201002', 'password' => bcrypt('password')]);
        $sofia = User::create(['name' => 'Sofía Vera', 'email' => 'sofia@espol.edu.ec', 'matricula' => '202201003', 'password' => bcrypt('password')]);
        $ieee = Comunidad::create(['nombre' => 'Capítulo IEEE ESPOL', 'categoria' => 'Técnica', 'facultad' => 'FIEC', 'descripcion' => 'Capítulo estudiantil de IEEE.']);
        $acm = Comunidad::create(['nombre' => 'ACM ESPOL', 'categoria' => 'Técnica', 'facultad' => 'FIEC', 'descripcion' => 'Comunidad de ciencias de la computación.']);
        $teatro = Comunidad::create(['nombre' => 'Grupo de Teatro', 'categoria' => 'Cultural', 'facultad' => 'FCSH', 'descripcion' => 'Grupo de artes escénicas.']);

        Membresia::create(['user_id' => $ana->id, 'comunidad_id' => $ieee->id, 'rol' => 'presidente', 'estado' => 'aprobada', 'fecha_ingreso' => '2025-03-01']);
        Membresia::create(['user_id' => $luis->id, 'comunidad_id' => $ieee->id, 'rol' => 'miembro', 'estado' => 'aprobada', 'fecha_ingreso' => '2025-08-15']);
        Membresia::create(['user_id' => $sofia->id, 'comunidad_id' => $ieee->id, 'rol' => 'miembro', 'estado' => 'pendiente']);

        Actividad::create(['comunidad_id' => $ieee->id, 'titulo' => 'Taller de IoT', 'tipo' => 'taller', 'fecha' => '2026-09-15', 'lugar' => 'Laboratorio de Redes']);
    }
}
