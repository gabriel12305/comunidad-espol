const BASE_URL = import.meta.env.VITE_API_URL;

const SANCTUM_URL = BASE_URL.replace(/\/api\/?$/, '');

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

function leerCookie(nombre: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${nombre}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

const METODOS_QUE_MUTAN = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

let cookieCsrfLista: Promise<void> | null = null;

function asegurarCookieCsrf(): Promise<void> {
  if (!cookieCsrfLista) {
    cookieCsrfLista = fetch(`${SANCTUM_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    }).then(() => undefined);
  }
  return cookieCsrfLista;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const metodo = (options.method ?? 'GET').toUpperCase();

  if (METODOS_QUE_MUTAN.has(metodo)) {
    await asegurarCookieCsrf();
  }

  const tokenCsrf = leerCookie('XSRF-TOKEN');

  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: 'include', 
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(tokenCsrf ? { 'X-XSRF-TOKEN': tokenCsrf } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que la API esté corriendo.');
  }

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.message ?? 'Ocurrió un error inesperado.',
      body?.errors
    );
  }

  return body as T;
}

export const api = {
  get:   <T>(path: string) => request<T>(path),
  post:  <T>(path: string, data: unknown) =>
           request<T>(path, { method: 'POST', body: JSON.stringify(data) }),
  patch: <T>(path: string, data: unknown) =>
           request<T>(path, { method: 'PATCH', body: JSON.stringify(data) }),
  put:   <T>(path: string, data: unknown) =>
           request<T>(path, { method: 'PUT', body: JSON.stringify(data) }),
  del:   <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
