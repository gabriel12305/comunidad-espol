export type RolPrincipal = 'estudiante' | 'lider';

export interface ComunidadLiderada {
  id: number;
  nombre: string;
}

export interface User {
  id: number;
  name: string;
  email?: string;
  matricula: string | null;
  rol_principal?: RolPrincipal;
  comunidades_lideradas?: ComunidadLiderada[];
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

export type TipoActividad = 'reunion' | 'taller' | 'charla' | 'evento_social' | 'otro';
export type Periodo = 'proximas' | 'pasadas';

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

export interface ActividadFormData {
  titulo: string;
  tipo: TipoActividad | '';
  fecha: string;
  lugar: string;
  descripcion: string;
}

// Parte de Milena
export interface ComunidadesResponse {
  total: number;
  data: Comunidad[];
}

export interface ComunidadFormData {
  nombre: string;
  categoria: string;
  facultad: string;
  descripcion: string;
  mision: string;
  logo_url: string;
  correo_contacto: string;
  instagram: string;
  fecha_fundacion: string;
}

export interface PadronResponse {
  comunidad: string;
  total: number;
  data: Membresia[];
}

export interface ActividadesResponse {
  comunidad: string;
  total: number;
  data: Actividad[];
}

export interface MensajeResponse<T> {
  message: string;
  data: T;
}