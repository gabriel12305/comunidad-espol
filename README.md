# ComunidadESPOL

Plataforma web para la gestión y difusión de comunidades estudiantiles de la ESPOL.

Proyecto de la asignatura **Lenguajes de Programación** — FIEC, ESPOL, PAO 1 2026–2027.

**Integrantes:** Milena Pazmiño · Gabriel Peláez · Carla Gutiérrez

---

## Stack

- **Back-end:** PHP 8.2 + Laravel 12 (API REST)
- **Front-end:** TypeScript + React
- **Base de datos:** MySQL 8

---

## Requisitos previos

- [XAMPP](https://www.apachefriends.org/) con **PHP 8.2 o superior** (solo se usa el módulo MySQL)
- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)

> En `C:\xampp\php\php.ini` deben estar activas (sin `;` al inicio) las extensiones:
> `extension=zip`, `extension=pdo_mysql`, `extension=mbstring`

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/USUARIO/comunidad-espol.git
cd comunidad-espol
```

### 2. Instalar dependencias

```bash
composer install
```

### 3. Configurar el entorno

```bash
copy .env.example .env
php artisan key:generate
```

### 4. Crear la base de datos

Enciende **MySQL** desde el panel de XAMPP, entra a `http://localhost/phpmyadmin` y crea una base de datos llamada `comunidad_espol` con cotejamiento `utf8mb4_unicode_ci`.

### 5. Configurar la conexión

Abre el archivo `.env` y deja estas líneas así (descoméntalas si tienen `#`):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=comunidad_espol
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Crear las tablas y cargar datos de prueba

```bash
php artisan migrate --seed
```

### 7. Levantar el servidor

```bash
php artisan serve
```

La API queda disponible en `http://localhost:8000`.

---

## Datos de prueba

| Usuario | Correo | Matrícula |
|---|---|---|
| Ana Torres | ana@espol.edu.ec | 202201001 |
| Luis Mora | luis@espol.edu.ec | 202201002 |
| Sofía Vera | sofia@espol.edu.ec | 202201003 |

Contraseña de todos: `password`

Comunidades: Capítulo IEEE ESPOL (id 1), ACM ESPOL (id 2), Grupo de Teatro (id 3).

---

## Endpoints

Todos con prefijo `/api`. Enviar siempre los headers:

```
Accept: application/json
Content-Type: application/json
```

Los códigos de estado usados son: `200` (OK), `201` (creado), `404` (no encontrado), `409` (conflicto con el estado actual) y `422` (error de validación).

### Comunidades — Milena

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `GET` | `/comunidades` | Catálogo, con filtros por categoría, facultad y nombre | `{ data: Comunidad[] }` |
| `GET` | `/comunidades/{id}` | Perfil de una comunidad. Devuelve 404 si el id no existe o no es numérico | `{ data: Comunidad }` |
| `POST` | `/comunidades` | Registrar comunidad | `{ data: Comunidad }` |
| `PUT` | `/comunidades/{id}` | Editar comunidad | `{ data: Comunidad }` |

### Membresías — Gabriel

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `POST` | `/comunidades/{id}/solicitudes` | Solicitar ingreso. Body: `{ user_id }`. Devuelve 409 si ya existe una membresía | `{ message, data: Membresia }` |
| `PATCH` | `/solicitudes/{id}` | Aprobar o rechazar. Body: `{ estado }` con valor `aprobada` o `rechazada`. Devuelve 409 si la solicitud ya fue resuelta | `{ message, data: Membresia }` |
| `GET` | `/comunidades/{id}/miembros` | Padrón. Filtros opcionales por query string: `?estado=` y `?rol=` | `{ comunidad, total, data: Membresia[] }` |

### Actividades — Carla

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| `POST` | `/comunidades/{id}/actividades` | Registrar actividad | — |
| `GET` | `/comunidades/{id}/actividades` | Historial de actividades de una comunidad | — |

## Flujo de trabajo con Git

Cada integrante trabaja en su propia rama:

| Integrante | Rama |
|---|---|
| Milena | `feature/comunidades` |
| Gabriel | `feature/membresias` |
| Carla | `feature/actividades` |

```bash
git checkout -b feature/mi-modulo
# ... trabajar ...
git add .
git commit -m "Descripción del cambio"
git push -u origin feature/mi-modulo
```

**Antes de empezar a trabajar cada día:**

```bash
git checkout main
git pull
git checkout feature/mi-modulo
git merge main
```

> En `routes/api.php` cada quien agrega sus rutas en su bloque comentado con su nombre. Es el único archivo donde puede haber conflictos.

---

## Comandos útiles

```bash
php artisan serve              # Levantar el servidor
php artisan migrate:fresh --seed   # Borrar y recrear todo (¡borra los datos!)
php artisan route:list         # Ver todas las rutas registradas
```

---

## Notas

- Los archivos `.env` y la carpeta `vendor/` **no se suben** al repositorio.
- En esta etapa los endpoints no requieren autenticación; el `user_id` se envía en el cuerpo de la petición. El login se implementará en el siguiente avance.

---

## Instalación del frontend

Requisito adicional: [Node.js](https://nodejs.org/) 20 o superior.

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar el entorno

```bash
copy .env.example .env
```

El archivo debe contener la URL de la API:

```env
VITE_API_URL=http://localhost:8000/api
```

> Si cambias el `.env`, hay que reiniciar `npm run dev`. Las variables se leen al arrancar.

### 3. Levantar el servidor de desarrollo

```bash
npm run dev
```

El frontend queda en `http://localhost:5173`.

---

## Ejecutar el proyecto

Se necesitan **dos terminales abiertas al mismo tiempo**:

| Terminal | Carpeta | Comando | Resultado |
|---|---|---|---|
| 1 | raíz | `php artisan serve` | API en `localhost:8000` |
| 2 | `frontend/` | `npm run dev` | Interfaz en `localhost:5173` |

También hay que tener **MySQL encendido** desde el panel de XAMPP.

---

## Estructura del frontend

```
frontend/src/
├── types/index.ts        # Tipos de la API — COMPARTIDO
├── api/client.ts         # Cliente HTTP — COMPARTIDO
├── styles/global.css     # Variables de color y tipografía — COMPARTIDO
├── services/             # Una función por endpoint
│   ├── membresias.ts     # Gabriel
│   ├── comunidades.ts    # Milena
│   └── actividades.ts    # Carla
├── pages/                # Una carpeta de pantallas por módulo
└── App.tsx               # Rutas — COMPARTIDO
```

**Archivos compartidos:** `types/index.ts`, `api/client.ts`, `styles/global.css` y `App.tsx`. Son los únicos donde puede haber conflictos de Git; coordinar antes de modificarlos.

### Convenciones

- **Estilos:** CSS Modules (`NombrePagina.module.css`), un archivo por pantalla. Usar siempre las variables de `global.css` (`var(--color-primario)`), nunca colores en duro.
- **Llamadas a la API:** siempre a través de `services/`. Ningún componente escribe una URL directamente.
- **Tipos:** todo lo que devuelve la API debe estar declarado en `types/index.ts`. Si agregas un endpoint, agrega su tipo.

---

## Rutas del frontend

| Ruta | Pantalla | Responsable |
|---|---|---|
| `/panel/padron` | Padrón de miembros | Gabriel |
| `/panel/solicitudes` | Solicitudes de ingreso | Gabriel |
| `/comunidades/:id` | Perfil de comunidad y solicitud de ingreso | Gabriel |
| `/comunidades` | Catálogo de comunidades | Milena — pendiente |
| `/actividades` | Cartelera de actividades | Carla — pendiente |
