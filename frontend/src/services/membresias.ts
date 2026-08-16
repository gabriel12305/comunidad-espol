import { api } from '../api/client';
import type { Membresia, PadronResponse, MensajeResponse } from '../types';

export function obtenerPadron(
  comunidadId: number,
  filtros: { estado?: string; rol?: string } = {}
) {
  const params = new URLSearchParams();
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.rol) params.append('rol', filtros.rol);

  const qs = params.toString() ? `?${params}` : '';
  return api.get<PadronResponse>(`/comunidades/${comunidadId}/miembros${qs}`);
}

export function solicitarIngreso(comunidadId: number, userId: number) {
  return api.post<MensajeResponse<Membresia>>(
    `/comunidades/${comunidadId}/solicitudes`,
    { user_id: userId }
  );
}

export function resolverSolicitud(
  solicitudId: number,
  estado: 'aprobada' | 'rechazada'
) {
  return api.patch<MensajeResponse<Membresia>>(
    `/solicitudes/${solicitudId}`,
    { estado }
  );
}