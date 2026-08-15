import { useEffect, useState } from 'react';
import { obtenerPadron, resolverSolicitud } from '../services/membresias';
import { ApiError } from '../api/client';
import type { Membresia, EstadoMembresia } from '../types';
import styles from './PadronPage.module.css';

const COMUNIDAD_ID = 1; // TODO: vendrá de la ruta y del usuario autenticado

const ETIQUETA_ESTADO: Record<EstadoMembresia, string> = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
};

export default function PadronPage() {
  const [miembros, setMiembros] = useState<Membresia[]>([]);
  const [comunidad, setComunidad] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState<number | null>(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);

    obtenerPadron(COMUNIDAD_ID, { estado: filtroEstado, rol: filtroRol })
      .then((res) => {
        if (!activo) return;
        setMiembros(res.data);
        setComunidad(res.comunidad);
        setError(null);
      })
      .catch((e: ApiError) => {
        if (activo) setError(e.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [filtroEstado, filtroRol]);

  async function handleResolver(id: number, estado: 'aprobada' | 'rechazada') {
    setProcesando(id);
    setError(null);
    try {
      const res = await resolverSolicitud(id, estado);
      setMiembros((prev) =>
        prev.map((m) => (m.id === id ? res.data : m))
      );
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Error inesperado.');
    } finally {
      setProcesando(null);
    }
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Padrón de miembros</h1>
        <p className={styles.subtitulo}>
          {comunidad || '—'} · {miembros.length} registros
        </p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}

      <div className={styles.filtros}>
        <select
          className={styles.select}
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Estado: todos</option>
          <option value="pendiente">Pendientes</option>
          <option value="aprobada">Aprobadas</option>
          <option value="rechazada">Rechazadas</option>
        </select>

        <select
          className={styles.select}
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
        >
          <option value="">Rol: todos</option>
          <option value="presidente">Presidente</option>
          <option value="secretaria">Secretaria</option>
          <option value="miembro">Miembro</option>
        </select>
      </div>

      <div className={styles.tarjeta}>
        {cargando ? (
          <p className={styles.vacio}>Cargando padrón…</p>
        ) : miembros.length === 0 ? (
          <p className={styles.vacio}>No hay miembros que coincidan con los filtros.</p>
        ) : (
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Miembro</th>
                <th>Matrícula</th>
                <th>Rol</th>
                <th>Fecha de ingreso</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {miembros.map((m) => (
                <tr key={m.id}>
                  <td>{m.user?.name ?? <span className={styles.suave}>—</span>}</td>
                  <td>{m.user?.matricula ?? <span className={styles.suave}>—</span>}</td>
                  <td style={{ textTransform: 'capitalize' }}>{m.rol}</td>
                  <td>{m.fecha_ingreso ?? <span className={styles.suave}>—</span>}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[m.estado]}`}>
                      {ETIQUETA_ESTADO[m.estado]}
                    </span>
                  </td>
                  <td>
                    {m.estado === 'pendiente' && (
                      <div className={styles.acciones}>
                        <button
                          className={styles.btnPrimario}
                          disabled={procesando === m.id}
                          onClick={() => handleResolver(m.id, 'aprobada')}
                        >
                          Aprobar
                        </button>
                        <button
                          className={styles.btnSecundario}
                          disabled={procesando === m.id}
                          onClick={() => handleResolver(m.id, 'rechazada')}
                        >
                          Rechazar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}