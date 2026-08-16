import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import PadronPage from './pages/PadronPage';
import SolicitudesPage from './pages/SolicitudesPage';
import ComunidadPage from './pages/ComunidadPage';
import ListadoActividades from './pages/Actividades/ListadoActividades';
import RegistrarActividad from './pages/Actividades/RegistrarActividad';
import CatalogoComunidades from './pages/Comunidades/CatalogoComunidades';
import RegistrarComunidad from './pages/Comunidades/RegistrarComunidad';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
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
          <NavLink
            to="/panel/comunidades/crear"
            className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
          >
            Registrar comunidad
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
            to="/comunidades/1/actividades"
            className={({ isActive }) => isActive ? styles.enlaceActivo : styles.enlace}
          >
            Historial de actividades
          </NavLink>
        </div>
      </nav>

      <Routes>
        {/* Gabriel*/}
        <Route path="/" element={<Navigate to="/panel/padron" replace />} />
        <Route path="/panel/padron" element={<PadronPage />} />
        <Route path="/panel/solicitudes" element={<SolicitudesPage />} />
        <Route path="/comunidades/:id" element={<ComunidadPage />} />

        {/* Parte de Milena */}
        <Route path="/comunidades" element={<CatalogoComunidades />} />
        <Route path="/panel/comunidades/crear" element={<RegistrarComunidad />} />
        <Route path="/panel/comunidades/:id/editar" element={<RegistrarComunidad />} />


        {/*Carla*/}
        <Route path="/panel/actividades/crear" element={<RegistrarActividad />} />
        <Route path="/comunidades/:id/actividades" element={<ListadoActividades />} />

      </Routes>
    </BrowserRouter>
  );
}