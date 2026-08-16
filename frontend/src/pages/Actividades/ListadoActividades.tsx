import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { obtenerActividades } from '../../services/actividades';
import { ApiError } from '../../api/client';
import type { Actividad } from '../../types';
import styles from './ListadoActividades.module.css';

const ETIQUETA_TIPO: Record<string, string> = {
  reunion: 'Reunión',
  taller: 'Taller',
  charla: 'Charla',
  evento_social: 'Evento social',
  otro: 'Otro',
};

function formatearFecha(fechaIso: string) {
  return new Date(`${fechaIso}T00:00:00`).toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function esProxima(fechaIso: string) {
  const hoy = new Date().toISOString().slice(0, 10);
  return fechaIso >= hoy;
}

export default function ListadoActividades() {
  const { id } = useParams<{ id: string }>();
  const comunidadId = Number(id);

  const [searchParams, setSearchParams] = useSearchParams();
  const tipo = searchParams.get('tipo') ?? '';
  const periodo = searchParams.get('periodo') ?? '';

  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [comunidad, setComunidad] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);

    obtenerActividades(comunidadId, { tipo, periodo })
      .then((res) => {
        if (!activo) return;
        setActividades(res.data);
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
  }, [comunidadId, tipo, periodo]);

  function actualizarFiltro(clave: 'tipo' | 'periodo', valor: string) {
    const params = new URLSearchParams(searchParams);
    if (valor) {
      params.set(clave, valor);
    } else {
      params.delete(clave);
    }
    setSearchParams(params);
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Historial de actividades</h1>
        <p className={styles.subtitulo}>
          {comunidad || `Comunidad #${comunidadId}`} · {actividades.length} registros
        </p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}

      <div className={styles.filtros}>
        <select
          className={styles.select}
          value={tipo}
          onChange={(e) => actualizarFiltro('tipo', e.target.value)}
        >
          <option value="">Tipo: todos</option>
          <option value="reunion">Reunión</option>
          <option value="taller">Taller</option>
          <option value="charla">Charla</option>
          <option value="evento_social">Evento social</option>
          <option value="otro">Otro</option>
        </select>

        <select
          className={styles.select}
          value={periodo}
          onChange={(e) => actualizarFiltro('periodo', e.target.value)}
        >
          <option value="">Período: todas</option>
          <option value="proximas">Próximas</option>
          <option value="pasadas">Pasadas</option>
        </select>
      </div>

      <div className={styles.tarjeta}>
        {cargando ? (
          <p className={styles.vacio}>Cargando actividades…</p>
        ) : actividades.length === 0 ? (
          <p className={styles.vacio}>No hay actividades que coincidan con los filtros.</p>
        ) : (
          <ul className={styles.lista}>
            {actividades.map((a) => (
              <li key={a.id} className={styles.item}>
                <div className={styles.itemCabecera}>
                  <h2 className={styles.itemTitulo}>{a.titulo}</h2>
                  <span
                    className={`${styles.badge} ${esProxima(a.fecha) ? styles.proxima : styles.pasada}`}
                  >
                    {esProxima(a.fecha) ? 'Próxima' : 'Pasada'}
                  </span>
                </div>
                <p className={styles.itemMeta}>
                  <span className={styles.etiquetaTipo}>
                    {ETIQUETA_TIPO[a.tipo] ?? a.tipo}
                  </span>
                  <span className={styles.separador}>·</span>
                  {formatearFecha(a.fecha)}
                  <span className={styles.separador}>·</span>
                  {a.lugar}
                </p>
                {a.descripcion && (
                  <p className={styles.itemDescripcion}>{a.descripcion}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
