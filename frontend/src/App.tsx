import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import PadronPage from './pages/PadronPage';
import SolicitudesPage from './pages/SolicitudesPage';
import ComunidadPage from './pages/ComunidadPage';
import ListadoActividades from './pages/Actividades/ListadoActividades';
import RegistrarActividad from './pages/Actividades/RegistrarActividad';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <nav className={styles.nav}>
        <div className={styles.navInterior}>
          <span className={styles.marca}>ComunidadESPOL</span>
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

        {/* Milena*/}










        {/*Carla*/}
        <Route path="/panel/actividades/crear" element={<RegistrarActividad />} />
        <Route path="/comunidades/:id/actividades" element={<ListadoActividades />} />

      </Routes>
    </BrowserRouter>
  );
}