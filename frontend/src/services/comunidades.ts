import { api } from '../api/client';
import type { Comunidad, ComunidadesResponse, ComunidadFormData, MensajeResponse } from '../types';

// Parte de Milena
// Servicios que consumen los endpoints de /api/comunidades

export function obtenerComunidades(
  filtros: { categoria?: string; facultad?: string; nombre?: string } = {}
) {
  const params = new URLSearchParams();
  if (filtros.categoria) params.append('categoria', filtros.categoria);
  if (filtros.facultad) params.append('facultad', filtros.facultad);
  if (filtros.nombre) params.append('nombre', filtros.nombre);

  const qs = params.toString() ? `?${params}` : '';
  return api.get<ComunidadesResponse>(`/comunidades${qs}`);
}

export function obtenerComunidad(id: number) {
  return api.get<MensajeResponse<Comunidad>>(`/comunidades/${id}`);
}

export function crearComunidad(userId: number, datos: ComunidadFormData) {
  return api.post<MensajeResponse<Comunidad>>('/comunidades', {
    user_id: userId,
    nombre: datos.nombre,
    categoria: datos.categoria,
    facultad: datos.facultad,
    descripcion: datos.descripcion,
    mision: datos.mision || null,
    logo_url: datos.logo_url || null,
    correo_contacto: datos.correo_contacto || null,
    instagram: datos.instagram || null,
    fecha_fundacion: datos.fecha_fundacion || null,
  });
}

export function actualizarComunidad(
  id: number,
  userId: number,
  datos: ComunidadFormData,
  activa: boolean
) {
  return api.put<MensajeResponse<Comunidad>>(`/comunidades/${id}`, {
    user_id: userId,
    nombre: datos.nombre,
    categoria: datos.categoria,
    facultad: datos.facultad,
    descripcion: datos.descripcion,
    mision: datos.mision || null,
    logo_url: datos.logo_url || null,
    correo_contacto: datos.correo_contacto || null,
    instagram: datos.instagram || null,
    fecha_fundacion: datos.fecha_fundacion || null,
    activa,
  });
}
