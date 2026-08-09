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

### Comunidades — Milena

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/comunidades` | Catálogo, con filtros por categoría, facultad y nombre |
| `GET` | `/comunidades/{id}` | Perfil de una comunidad |
| `POST` | `/comunidades` | Registrar comunidad |
| `PUT` | `/comunidades/{id}` | Editar comunidad |

### Membresías — Gabriel

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/comunidades/{id}/solicitudes` | Solicitar ingreso a una comunidad |
| `PATCH` | `/solicitudes/{id}` | Aprobar o rechazar una solicitud |
| `GET` | `/comunidades/{id}/miembros` | Padrón, filtrable por `estado` y `rol` |

### Actividades — Carla

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/actividades` | Cartelera, filtrable por comunidad |
| `POST` | `/comunidades/{id}/actividades` | Registrar actividad |
| `PUT` | `/actividades/{id}` | Editar actividad |
| `DELETE` | `/actividades/{id}` | Eliminar actividad |

---

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
