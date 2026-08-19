import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';
import type { RolPrincipal } from '../types';

interface Props {
  rol: RolPrincipal;
  children: ReactNode;
}

export default function RoleRoute({ rol, children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  const rolUsuario = user.rol_principal ?? 'estudiante';

  if (rolUsuario !== rol) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return <>{children}</>;
}
