import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { obtenerComunidades } from '../../services/comunidades';
import { ApiError } from '../../api/client';
import type { Comunidad } from '../../types';
import styles from './CatalogoComunidades.module.css';

// Parte de Milena
// Requerimiento: Explorar catálogo de comunidades (lectura)
export default function CatalogoComunidades() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const nombre = searchParams.get('nombre') ?? '';
  const categoria = searchParams.get('categoria') ?? '';
  const facultad = searchParams.get('facultad') ?? '';

  const [comunidades, setComunidades] = useState<Comunidad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);

    obtenerComunidades({ nombre, categoria, facultad })
      .then((res) => {
        if (!activo) return;
        setComunidades(res.data);
        setError(null);
      })
      .catch((e: ApiError) => {
        if (activo) setError(e.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [nombre, categoria, facultad]);

  function actualizarFiltro(clave: 'nombre' | 'categoria' | 'facultad', valor: string) {
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
        <h1 className={styles.titulo}>Catálogo de comunidades</h1>
        <p className={styles.subtitulo}>{comunidades.length} comunidades activas</p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}

      <div className={styles.filtros}>
        <input
          className={styles.buscador}
          type="text"
          placeholder="Buscar por nombre…"
          value={nombre}
          onChange={(e) => actualizarFiltro('nombre', e.target.value)}
        />

        <select
          className={styles.select}
          value={categoria}
          onChange={(e) => actualizarFiltro('categoria', e.target.value)}
        >
          <option value="">Categoría: todas</option>
          <option value="Técnica">Técnica</option>
          <option value="Cultural">Cultural</option>
          <option value="Deportiva">Deportiva</option>
          <option value="Social">Social</option>
        </select>

        <select
          className={styles.select}
          value={facultad}
          onChange={(e) => actualizarFiltro('facultad', e.target.value)}
        >
          <option value="">Facultad: todas</option>
          <option value="FIEC">FIEC</option>
          <option value="FCNM">FCNM</option>
          <option value="FIMCP">FIMCP</option>
          <option value="FCV">FCV</option>
          <option value="FCSH">FCSH</option>
          <option value="FADCOM">FADCOM</option>
          <option value="FICT">FICT</option>
        </select>
      </div>

      {cargando ? (
        <p className={styles.vacio}>Cargando comunidades…</p>
      ) : comunidades.length === 0 ? (
        <p className={styles.vacio}>No hay comunidades que coincidan con los filtros.</p>
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
              </div>

              <p className={styles.descripcion}>{c.descripcion}</p>

              <div className={styles.acciones}>
                {/* Conexión con el perfil de comunidad de Gabriel: solicitud de ingreso */}
                <Link to={`/comunidades/${c.id}`} className={styles.btnVerPerfil}>
                  Ver comunidad
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
