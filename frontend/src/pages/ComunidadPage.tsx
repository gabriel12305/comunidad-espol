import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../api/client';
import { obtenerPadron, solicitarIngreso } from '../services/membresias';
import type { Comunidad, Membresia } from '../types';
import styles from './ComunidadPage.module.css';

export default function ComunidadPage() {
  const { id } = useParams<{ id: string }>();
  const comunidadId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const esLiderDeEstaComunidad = user?.comunidades_lideradas?.some((c) => c.id === comunidadId) ?? false;

  const [comunidad, setComunidad] = useState<Comunidad | null>(null);
  const [miMembresia, setMiMembresia] = useState<Membresia | null>(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);

    Promise.all([
      api.get<{ data: Comunidad }>(`/comunidades/${comunidadId}`)
        .catch(() => null),
      obtenerPadron(comunidadId).catch(() => null),
    ])
      .then(([resComunidad, resPadron]) => {
        if (!activo) return;

        if (resComunidad) {
          setComunidad(resComunidad.data);
        }

        if (resPadron && user) {
          const mia = resPadron.data.find((m) => m.user_id === user.id);
          setMiMembresia(mia ?? null);
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [comunidadId, user]);

  async function handleSolicitar() {
    if (!user) {
      navigate('/login', { state: { desde: `/comunidades/${comunidadId}` } });
      return;
    }

    setEnviando(true);
    setError(null);
    setExito(null);

    try {
      const res = await solicitarIngreso(comunidadId);
      setMiMembresia(res.data);
      setExito(res.message);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return <div className={styles.pagina}><p className={styles.cargando}>Cargando…</p></div>;
  }

  return (
    <div className={styles.pagina}>
      {comunidad?.logo_url ? (
      <img
          src={comunidad.logo_url}
          alt={`Logo de ${comunidad.nombre}`}
          className={styles.logo}
      />
      ) : (
      <div className={styles.logoVacio}>Sin logo</div>
      )}

      <header className={styles.cabecera}>
        <h1 className={styles.titulo}>
          {comunidad?.nombre ?? `Comunidad #${comunidadId}`}
        </h1>
        {comunidad && (
          <div className={styles.etiquetas}>
            <span className={styles.etiqueta}>{comunidad.categoria}</span>
            <span className={styles.etiqueta}>{comunidad.facultad}</span>
          </div>
        )}

        {esLiderDeEstaComunidad && (
          <button
            type="button"
            className={styles.btnEditar}
            onClick={() => navigate(`/panel/comunidades/${comunidadId}/editar`)}
          >
            Editar comunidad
          </button>
        )}
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}
      {exito && <div className={styles.mensajeExito}>{exito}</div>}

      <div className={styles.columnas}>
        <section className={styles.tarjeta}>
          <h2 className={styles.subtitulo}>Sobre la comunidad</h2>
          <p className={styles.parrafo}>
            {comunidad?.descripcion ?? 'Información no disponible.'}
          </p>

          {comunidad?.mision && (
            <>
              <h2 className={styles.subtitulo}>Misión</h2>
              <p className={styles.parrafo}>{comunidad.mision}</p>
            </>
          )}
        </section>

        <aside>
          <div className={styles.tarjeta}>
            {!user ? (
              <p className={styles.avisoLogin}>
                <Link to="/login" state={{ desde: `/comunidades/${comunidadId}` }}>
                  Inicia sesión
                </Link>{' '}
                para solicitar tu ingreso a esta comunidad.
              </p>
            ) : (
              <button
                className={styles.btnSolicitar}
                disabled={enviando || miMembresia !== null}
                onClick={handleSolicitar}
              >
                {enviando ? 'Enviando…' : 'Solicitar ingreso'}
              </button>
            )}

            {miMembresia && (
              <p className={styles.estadoSolicitud}>
                Estado de tu solicitud:
                <span className={`${styles.badge} ${styles[miMembresia.estado]}`}>
                  {miMembresia.estado}
                </span>
              </p>
            )}
          </div>

          {comunidad?.correo_contacto && (
            <div className={styles.tarjeta} style={{ marginTop: 16 }}>
              <h2 className={styles.subtitulo}>Contacto</h2>
              <p className={styles.contacto}>{comunidad.correo_contacto}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}