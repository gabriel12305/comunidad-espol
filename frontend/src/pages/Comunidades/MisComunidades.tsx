import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obtenerComunidad } from '../../services/comunidades';
import type { Comunidad } from '../../types';
import styles from './MisComunidades.module.css';

// Parte de Milena
// Punto de acceso para que el líder vuelva a una comunidad que ya no aparece en el catálogo
// público por estar inactiva (GET /comunidades solo lista activa: true) y pueda reactivarla
// desde el mismo formulario de registro/edición. Se apoya en comunidades_lideradas, que la
// sesión (AuthController::serializarUsuario) entrega sin filtrar por estado de la comunidad.
export default function MisComunidades() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const comunidadesLideradas = user?.comunidades_lideradas ?? [];
  const idsLiderados = comunidadesLideradas.map((c) => c.id).join(',');

  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idsLiderados) {
      setComunidades([]);
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);
    setError(null);

    const ids = idsLiderados.split(',').map(Number);

    Promise.all(
      ids.map((id) =>
        obtenerComunidad(id)
          .then((res) => res.data)
          .catch(() => null)
      )
    )
      .then((resultados) => {
        if (!activo) return;
        const validas = resultados.filter((c): c is Comunidad => c !== null);
        setComunidades(validas);
        setError(validas.length < ids.length ? 'Algunas comunidades no se pudieron cargar.' : null);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [idsLiderados]);

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Mis comunidades</h1>
        <p className={styles.subtitulo}>
          Incluye las que lideras aunque estén inactivas y ya no aparezcan en el catálogo público.
        </p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}

      {cargando ? (
        <p className={styles.vacio}>Cargando…</p>
      ) : comunidades.length === 0 ? (
        <p className={styles.vacio}>No lideras ninguna comunidad todavía.</p>
      ) : (
        <div className={styles.grid}>
          {comunidades.map((c) => (
            <div key={c.id} className={styles.tarjeta}>
              {c.logo_url ? (
                <img src={c.logo_url} alt={`Logo de ${c.nombre}`} className={styles.logo} />
              ) : (
                <div className={styles.logoVacio}>Sin logo</div>
              )}

              <h2 className={styles.nombre}>{c.nombre}</h2>

              <div className={styles.etiquetas}>
                <span className={styles.etiqueta}>{c.categoria}</span>
                <span className={styles.etiqueta}>{c.facultad}</span>
                <span className={`${styles.badge} ${c.activa ? styles.activa : styles.inactiva}`}>
                  {c.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <p className={styles.descripcion}>{c.descripcion}</p>

              <div className={styles.acciones}>
                <Link to={`/comunidades/${c.id}`} className={styles.btnVerPerfil}>
                  Ver perfil
                </Link>
                <button
                  type="button"
                  className={styles.btnEditar}
                  onClick={() => navigate(`/panel/comunidades/${c.id}/editar`)}
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
