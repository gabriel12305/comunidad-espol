import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import RoleRoute from './components/RoleRoute';
import LoginPage from './pages/LoginPage';
import NoAutorizado from './pages/NoAutorizado';
import PadronPage from './pages/PadronPage';
import SolicitudesPage from './pages/SolicitudesPage';
import ComunidadPage from './pages/ComunidadPage';
import ListadoActividades from './pages/Actividades/ListadoActividades';
import RegistrarActividad from './pages/Actividades/RegistrarActividad';
import CatalogoComunidades from './pages/Comunidades/CatalogoComunidades';
import RegistrarComunidad from './pages/Comunidades/RegistrarComunidad';
import MisComunidades from './pages/Comunidades/MisComunidades';
import styles from './App.module.css';

function Navegacion() {
  const { user, logout } = useAuth();
  const esLider = user?.rol_principal === 'lider';

  return (
    <nav className={styles.nav}>
      <div className={styles.navInterior}>
        <span className={styles.marca}>ComunidadESPOL</span>

        {/* Parte de Milena */}
        <NavLink
          to="/comunidades"
          className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
        >
          Comunidades
        </NavLink>

        {user && (
          <NavLink
            to="/panel/comunidades/crear"
            className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
          >
            Registrar comunidad
          </NavLink>
        )}

        {/* Panel de líder: solo visible para quien lidera alguna comunidad */}
        {esLider && (
          <>
            <NavLink
              to="/panel/mis-comunidades"
              className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
            >
              Mis comunidades
            </NavLink>
            <NavLink
              to="/panel/solicitudes"
              className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
            >
              Solicitudes
            </NavLink>
            <NavLink
              to="/panel/padron"
              className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
            >
              Padrón
            </NavLink>
            <NavLink
              to="/panel/actividades/crear"
              className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
            >
              Registrar actividad
            </NavLink>
            <NavLink
              to={`/comunidades/${user?.comunidades_lideradas?.[0]?.id}/actividades`}
              className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
            >
              Historial de actividades
            </NavLink>
          </>
        )}

        <div className={styles.navDerecha}>
          {user ? (
            <>
              <span className={styles.usuario}>{user.name}</span>
              <button type="button" className={styles.btnSalir} onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
            >
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navegacion />

        <Routes>
          <Route path="/" element={<Navigate to="/comunidades" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/no-autorizado" element={<NoAutorizado />} />

          {/* Parte de Milena — catálogo y perfil público, registro/edición protegidos */}
          <Route path="/comunidades" element={<CatalogoComunidades />} />
          <Route
            path="/panel/comunidades/crear"
            element={<PrivateRoute><RegistrarComunidad /></PrivateRoute>}
          />
          <Route
            path="/panel/comunidades/:id/editar"
            element={<RoleRoute rol="lider"><RegistrarComunidad /></RoleRoute>}
          />
          <Route
            path="/panel/mis-comunidades"
            element={<RoleRoute rol="lider"><MisComunidades /></RoleRoute>}
          />

          {/* Gabriel — perfil de comunidad público, panel de líder protegido */}
          <Route path="/comunidades/:id" element={<ComunidadPage />} />
          <Route
            path="/panel/padron"
            element={<RoleRoute rol="lider"><PadronPage /></RoleRoute>}
          />
          <Route
            path="/panel/solicitudes"
            element={<RoleRoute rol="lider"><SolicitudesPage /></RoleRoute>}
          />

          {/* Carla — historial público, registro de actividades protegido */}
          <Route path="/comunidades/:id/actividades" element={<ListadoActividades />} />
          <Route
            path="/panel/actividades/crear"
            element={<RoleRoute rol="lider"><RegistrarActividad /></RoleRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
