# ComunidadESPOL — Guía de instalación y ejecución

Plataforma web para la gestión de comunidades estudiantiles de la ESPOL.
Backend en **Laravel 12 (PHP 8.2)** + Frontend en **React 19 (TypeScript, Vite)**, comunicados vía API REST con autenticación por sesión (Laravel Sanctum).

---

## 1. Requisitos previos

Instalar antes de empezar:

| Herramienta | Versión mínima | Notas |
|---|---|---|
| [PHP](https://www.php.net/) | 8.2 | Debe incluir la extensión `sqlite3` (viene activada por defecto en la mayoría de instalaciones) |
| [Composer](https://getcomposer.org/) | 2.x | Gestor de dependencias de PHP |
| [Node.js](https://nodejs.org/) | 20 o superior | Incluye `npm` |

No se necesita instalar MySQL, XAMPP ni ningún gestor de base de datos: el proyecto usa **SQLite**, que es un solo archivo local y no requiere servidor.

---

## 2. Obtener el proyecto

Descomprimir el `.zip` descargado de GitHub en cualquier carpeta, por ejemplo:

C:\proyectos\comunidad-espol

Abrir una terminal (PowerShell o CMD) dentro de esa carpeta para los pasos siguientes.

---

## 3. Backend (Laravel)

### 3.1 Instalar dependencias PHP

```bash
composer install

3.2 Crear el archivo de entorno

copy .env.example .env
php artisan key:generate

▎ No hace falta tocar nada más en .env: ya viene configurado con DB_CONNECTION=sqlite, y con FRONTEND_URL/SANCTUM_STATEFUL_DOMAINS apuntando a localhost:5173 (el puerto del frontend), que es lo necesario para que el login funcione.

3.3 Crear el archivo de base de datos

SQLite guarda toda la base en un solo archivo. Hay que crearlo vacío antes de migrar:

type nul > database\database.sqlite

(en PowerShell también funciona: New-Item database\database.sqlite -ItemType File)

3.4 Crear las tablas y cargar datos de prueba

php artisan migrate --seed

Esto crea las tablas dentro de database/database.sqlite y carga usuarios, comunidades y membresías de ejemplo (ver sección 6).

---

4. Frontend (React)

4.1 Instalar dependencias

cd frontend
npm install

4.2 Configurar el entorno

copy .env.example .env

Verificar que frontend/.env quede así (apunta al backend del paso 3):

env
VITE_API_URL=http://localhost:8000/api

---

5. Ejecutar el proyecto

Se necesitan dos terminales abiertas al mismo tiempo:

┌──────────┬───────────────────┬───────────────────┬───────────────────────────────────┐
│ Terminal │      Carpeta      │      Comando      │             Resultado             │
├──────────┼───────────────────┼───────────────────┼───────────────────────────────────┤
│ 1        │ raíz del proyecto │ php artisan serve │ API en http://localhost:8000      │
├──────────┼───────────────────┼───────────────────┼───────────────────────────────────┤
│ 2        │ frontend/         │ npm run dev       │ Interfaz en http://localhost:5173 │
└──────────┴───────────────────┴───────────────────┴───────────────────────────────────┘

▎ No usar composer run dev: ese script está pensado para el scaffolding por defecto de Laravel y no levanta el frontend real del proyecto (que vive en frontend/). Usar los dos comandos de la tabla, cada uno en su terminal.

Abrir el navegador en http://localhost:5173.

---

6. Datos de prueba (seeder)

Todos los usuarios tienen la contraseña: password

┌────────────┬────────────────────┬───────────┬──────────────────────────────────────────┐
│  Usuario   │       Correo       │ Matrícula │                   Rol                    │
├────────────┼────────────────────┼───────────┼──────────────────────────────────────────┤
│ Ana Torres │ ana@espol.edu.ec   │ 202201001 │ Líder (presidenta de IEEE ESPOL)         │
├────────────┼────────────────────┼───────────┼──────────────────────────────────────────┤
│ Luis Mora  │ luis@espol.edu.ec  │ 202201002 │ Estudiante (miembro aprobado de IEEE)    │
├────────────┼────────────────────┼───────────┼──────────────────────────────────────────┤
│ Sofía Vera │ sofia@espol.edu.ec │ 202201003 │ Estudiante (solicitud pendiente en IEEE) │
└────────────┴────────────────────┴───────────┴──────────────────────────────────────────┘

Comunidades precargadas: Capítulo IEEE ESPOL, ACM ESPOL, Grupo de Teatro.

Flujo sugerido para probar

1. Entrar a http://localhost:5173 → se ve el catálogo de comunidades (público, sin login).
2. Iniciar sesión con ana@espol.edu.ec / password → Ana es líder, así que aparecen en el menú Solicitudes, Padrón, Registrar actividad e Historial de actividades.
3. En Solicitudes, aprobar o rechazar la solicitud pendiente de Sofía.
4. En Padrón, ver el listado de miembros de IEEE ESPOL.
5. Cerrar sesión e iniciar con luis@espol.edu.ec / password → como no es líder, esas opciones no aparecen (solo puede ver el catálogo y registrar comunidades).

Probar el soporte multi-comunidad (un líder con más de una comunidad)

El seeder solo deja a Ana como presidenta de IEEE ESPOL. Para probar que un mismo usuario puede liderar varias comunidades a la vez:

1. Con la sesión de Ana iniciada, ir a Registrar comunidad y crear una segunda comunidad (por ejemplo, "Club de Robótica"). Quien registra una comunidad queda automáticamente como su presidenta/presidente.
2. En Solicitudes, ahora deben verse juntas las solicitudes de ambas comunidades, cada una con su columna Comunidad para identificarlas.
3. En Padrón, aparece un selector para elegir entre las comunidades que lidera y ver el padrón de cada una.
4. En Registrar actividad, aparece un campo Comunidad para elegir a cuál de las dos se le registra la actividad.
5. En Historial de actividades, si lidera más de una comunidad, aparece un selector para cambiar entre ellas.

---

7. Cambios recientes

- Solicitudes multi-comunidad: nuevo endpoint GET /api/solicitudes que trae, en una sola llamada, las solicitudes de todas las comunidades que lidera el usuario autenticado (antes solo mostraba la primera). Cada solicitud incluye su comunidad anidada para poder distinguirlas en la tabla.
- Padrón: se agregó un selector para elegir entre las comunidades que lidera el usuario, en vez de mostrar siempre la primera.
- Registrar actividad: se agregó un campo para elegir a qué comunidad pertenece la actividad, en vez de asignarla siempre a la primera comunidad liderada.
- Historial de actividades: ahora tiene su propia pestaña en el menú principal (antes solo se llegaba desde el botón "Ver historial" tras registrar una actividad). Si el usuario lidera más de una comunidad, puede cambiar entre ellas desde un selector dentro de la página.
- Menú de navegación: ajustado para acomodar los enlaces nuevos sin que se vean espacios irregulares en pantallas más angostas.

---

8. Problemas comunes

┌───────────────────┬──────────────────────────────┬──────────────────────────────────────────────────────────────┐
│      Síntoma      │        Causa probable        │                           Solución                           │
├───────────────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Error al migrar:  │ No se creó                   │                                                              │
│ "unable to open   │ database/database.sqlite     │ Repetir el paso 3.3 antes de migrar                          │
│ database file"    │                              │                                                              │
├───────────────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ El login da error │ El puerto del frontend no    │                                                              │
│  500 "Session     │ coincide con                 │ Verificar que el frontend corra en :5173 y que .env tenga    │
│ store not set on  │ SANCTUM_STATEFUL_DOMAINS en  │ SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173       │
│ request"          │ .env                         │                                                              │
├───────────────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ "No se pudo       │                              │                                                              │
│ conectar con el   │ El backend (php artisan      │ Verificar la terminal 1; debe decir Server running on        │
│ servidor" en el   │ serve) no está corriendo     │ [http://127.0.0.1:8000]                                      │
│ navegador         │                              │                                                              │
├───────────────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Página en blanco  │                              │                                                              │
│ o error de CORS   │ frontend/.env no apunta al   │ Verificar VITE_API_URL=http://localhost:8000/api y reiniciar │
│ en la consola del │ backend correcto             │  npm run dev (Vite solo lee .env al arrancar)                │
│  navegador        │                              │                                                              │
├───────────────────┼──────────────────────────────┼──────────────────────────────────────────────────────────────┤
│ Las credenciales  │ La base de datos no se       │ Ejecutar php artisan migrate:fresh --seed (esto borra y      │
│ de prueba no      │ sembró                       │ recrea todo)                                                 │
│ funcionan         │                              │                                                              │
└───────────────────┴──────────────────────────────┴──────────────────────────────────────────────────────────────┘

---

9. Comandos útiles

php artisan serve                    # Levantar la API
php artisan migrate:fresh --seed     # Borrar y recargar la base con datos de prueba
php artisan route:list               # Ver todas las rutas registradas
php artisan tinker                   # Consola interactiva para inspeccionar datos

Cambios respecto a tu versión original:
- Nueva sección **6 → "Probar el soporte multi-comunidad"** con los pasos concretos para verificar lo que arreglamos.
- Nueva sección **7 → "Cambios recientes"**, a modo de changelog corto de lo que hicimos en esta conversación.
- Renumeré "Problemas comunes" (ahora 8) y "Comandos útiles" (ahora 9).
- Actualicé el paso 2 del flujo original para mencionar la nueva pestaña "Historial de actividades" en el menú.