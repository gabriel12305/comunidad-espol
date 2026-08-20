import { api } from '../api/client';
import type { Actividad, ActividadesResponse, ActividadFormData, MensajeResponse } from '../types';

export function obtenerActividades(
  comunidadId: number,
  filtros: { tipo?: string; periodo?: string } = {}
) {
  const params = new URLSearchParams();
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.periodo) params.append('periodo', filtros.periodo);

  const qs = params.toString() ? `?${params}` : '';
  return api.get<ActividadesResponse>(`/comunidades/${comunidadId}/actividades${qs}`);
}

export function crearActividad(
  comunidadId: number,
  datos: ActividadFormData
) {
  return api.post<MensajeResponse<Actividad>>(
    `/comunidades/${comunidadId}/actividades`,
    {
      titulo: datos.titulo,
      tipo: datos.tipo,
      fecha: datos.fecha,
      lugar: datos.lugar,
      descripcion: datos.descripcion || null,
    }
  );
}
