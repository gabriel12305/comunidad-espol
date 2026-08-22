import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerSolicitudesLideradas, resolverSolicitud } from '../services/membresias';
import { ApiError } from '../api/client';
import type { Membresia, EstadoMembresia } from '../types';
import styles from './SolicitudesPage.module.css';

const TABS: { valor: EstadoMembresia; etiqueta: string }[] = [
  { valor: 'pendiente',  etiqueta: 'Pendientes' },
  { valor: 'aprobada',   etiqueta: 'Aprobadas' },
  { valor: 'rechazada',  etiqueta: 'Rechazadas' },
];

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function SolicitudesPage() {
  const { user } = useAuth();
  const tieneComunidades = (user?.comunidades_lideradas?.length ?? 0) > 0;

  const [solicitudes, setSolicitudes] = useState<Membresia[]>([]);
  const [tab, setTab] = useState<EstadoMembresia>('pendiente');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<number | null>(null);

  useEffect(() => {
      if (!tieneComunidades) {
        setCargando(false);
        return;
      }

      let activo = true;
      setCargando(true);

      obtenerSolicitudesLideradas({ estado: tab })
        .then((res) => {
          if (!activo) return;
          setSolicitudes(res.data);
          setError(null);
        })
        .catch((e: ApiError) => {
          if (activo) setError(e.message);
        })
        .finally(() => {
          if (activo) setCargando(false);
        });

      return () => { activo = false; };
    }, [tieneComunidades, tab]);

  async function handleResolver(id: number, estado: 'aprobada' | 'rechazada') {
    setProcesando(id);
    setError(null);
    setExito(null);

    try {
      const res = await resolverSolicitud(id, estado);
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      setExito(res.message);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error inesperado.');
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Solicitudes de ingreso</h1>
        <p className={styles.subtitulo}>
          {cargando ? 'Cargando…' : `${solicitudes.length} solicitudes en esta vista`}
        </p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}
      {exito && <div className={styles.mensajeExito}>{exito}</div>}

      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t.valor}
            className={`${styles.tab} ${tab === t.valor ? styles.tabActiva : ''}`}
            onClick={() => setTab(t.valor)}
          >
            {t.etiqueta}
          </button>
        ))}
      </div>

      <div className={styles.tarjeta}>
        {cargando ? (
          <p className={styles.vacio}>Cargando solicitudes…</p>
        ) : !tieneComunidades ? (
          <p className={styles.vacio}>No lideras ninguna comunidad activa.</p>
        ) : solicitudes.length === 0 ? (
          <p className={styles.vacio}>No hay solicitudes en esta categoría.</p>
        ) : (
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Comunidad</th>
                <th>Matrícula</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s) => (
                <tr key={s.id}>
                  <td>{s.user?.name ?? <span className={styles.suave}>—</span>}</td>
                  <td>{s.comunidad?.nombre ?? <span className={styles.suave}>—</span>}</td>
                  <td>{s.user?.matricula ?? <span className={styles.suave}>—</span>}</td>
                  <td>{formatearFecha(s.created_at)}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[s.estado]}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    {s.estado === 'pendiente' ? (
                      <div className={styles.acciones}>
                        <button
                          className={styles.btnPrimario}
                          disabled={procesando === s.id}
                          onClick={() => handleResolver(s.id, 'aprobada')}
                        >
                          Aprobar
                        </button>
                        <button
                          className={styles.btnSecundario}
                          disabled={procesando === s.id}
                          onClick={() => handleResolver(s.id, 'rechazada')}
                        >
                          Rechazar
                        </button>
                      </div>
                    ) : (
                      <span className={styles.suave}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {tab === 'pendiente' && (
        <p className={styles.nota}>
          Al aprobar, el estudiante pasa al padrón como miembro activo.
        </p>
      )}
    </div>
  );
}