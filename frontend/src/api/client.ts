const BASE_URL = import.meta.env.VITE_API_URL;

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

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor. Verifica que la API esté corriendo.');
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