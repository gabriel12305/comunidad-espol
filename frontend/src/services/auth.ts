import { api } from '../api/client';
import type { User, MensajeResponse } from '../types';

export function login(email: string, password: string) {
  return api.post<MensajeResponse<User>>('/login', { email, password });
}

export function logout() {
  return api.post<{ message: string }>('/logout', {});
}

export function obtenerUsuarioActual() {
  return api.get<{ data: User }>('/user');
}
