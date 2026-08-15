export interface User {
  id: number;
  name: string;
  email?: string;
  matricula: string | null;
}

export interface Comunidad {
  id: number;
  nombre: string;
  categoria: string;
  facultad: string;
  descripcion: string;
  mision: string | null;
  logo_url: string | null;
  correo_contacto: string | null;
  instagram: string | null;
  fecha_fundacion: string | null;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

export type EstadoMembresia = 'pendiente' | 'aprobada' | 'rechazada';
export type RolMembresia = 'presidente' | 'secretaria' | 'miembro';

export interface Membresia {
  id: number;
  user_id: number;
  comunidad_id: number;
  rol: RolMembresia;
  estado: EstadoMembresia;
  fecha_ingreso: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  comunidad?: Comunidad;
}

export interface Actividad {
  id: number;
  comunidad_id: number;
  titulo: string;
  tipo: string;
  fecha: string;
  lugar: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}

// ===== Respuestas de la API =====

export interface PadronResponse {
  comunidad: string;
  total: number;
  data: Membresia[];
}

export interface MensajeResponse<T> {
  message: string;
  data: T;
}