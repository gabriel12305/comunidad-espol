import { Link } from 'react-router-dom';
import styles from './NoAutorizado.module.css';

export default function NoAutorizado() {
  return (
    <div className={styles.pagina}>
      <div className={styles.tarjeta}>
        <h1 className={styles.titulo}>Acceso no autorizado</h1>
        <p className={styles.mensaje}>
          No tienes permiso para ver esta página. Esta sección está reservada
          para líderes de comunidad.
        </p>
        <Link to="/comunidades" className={styles.enlace}>Volver al catálogo</Link>
      </div>
    </div>
  );
}
