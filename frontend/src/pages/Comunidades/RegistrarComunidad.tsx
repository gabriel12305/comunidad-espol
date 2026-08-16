import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { crearComunidad, actualizarComunidad, obtenerComunidad } from '../../services/comunidades';
import { ApiError } from '../../api/client';
import type { ComunidadFormData } from '../../types';
import styles from './RegistrarComunidad.module.css';

// Parte de Milena
// Requerimiento: Registrar comunidad (escritura), incluye edición

const USUARIO_ID = 1; // TODO: vendrá del usuario autenticado (líder de la comunidad)

const FORM_VACIO: ComunidadFormData = {
  nombre: '',
  categoria: '',
  facultad: '',
  descripcion: '',
  mision: '',
  logo_url: '',
  correo_contacto: '',
  instagram: '',
  fecha_fundacion: '',
};

function validar(datos: ComunidadFormData): Record<string, string> {
  const errores: Record<string, string> = {};
  if (!datos.nombre.trim()) errores.nombre = 'El nombre de la comunidad es obligatorio.';
  if (!datos.categoria) errores.categoria = 'Debe indicar la categoría de la comunidad.';
  if (!datos.facultad) errores.facultad = 'Debe indicar la facultad de la comunidad.';
  if (!datos.descripcion.trim()) errores.descripcion = 'Debe indicar una descripción de la comunidad.';
  if (datos.logo_url && !/^https?:\/\/.+/i.test(datos.logo_url)) {
    errores.logo_url = 'El logo debe ser una URL válida.';
  }
  if (datos.correo_contacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo_contacto)) {
    errores.correo_contacto = 'El correo de contacto no es válido.';
  }
  return errores;
}

export default function RegistrarComunidad() {
  const { id } = useParams<{ id: string }>();
  const editando = id !== undefined;
  const comunidadId = Number(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<ComunidadFormData>(FORM_VACIO);
  const [activa, setActiva] = useState(true);
  const [erroresCampo, setErroresCampo] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(editando);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    if (!editando) return;

    let activo = true;
    setCargando(true);

    obtenerComunidad(comunidadId)
      .then((res) => {
        if (!activo) return;
        const c = res.data;
        setForm({
          nombre: c.nombre,
          categoria: c.categoria,
          facultad: c.facultad,
          descripcion: c.descripcion,
          mision: c.mision ?? '',
          logo_url: c.logo_url ?? '',
          correo_contacto: c.correo_contacto ?? '',
          instagram: c.instagram ?? '',
          fecha_fundacion: c.fecha_fundacion ?? '',
        });
        setActiva(c.activa);
        setError(null);
      })
      .catch((e: ApiError) => {
        if (activo) setError(e.message);
      })
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => { activo = false; };
  }, [editando, comunidadId]);

  function actualizarCampo<K extends keyof ComunidadFormData>(campo: K, valor: ComunidadFormData[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const erroresCliente = validar(form);
    setErroresCampo(erroresCliente);
    if (Object.keys(erroresCliente).length > 0) return;

    setEnviando(true);
    setError(null);
    setExito(null);

    try {
      const res = editando
        ? await actualizarComunidad(comunidadId, USUARIO_ID, form, activa)
        : await crearComunidad(USUARIO_ID, form);

      setExito(res.message);
      if (!editando) setForm(FORM_VACIO);
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        // Errores 422 de Laravel: { campo: ["mensaje"] }
        const porCampo: Record<string, string> = {};
        for (const [campo, mensajes] of Object.entries(e.errors)) {
          porCampo[campo] = mensajes[0];
        }
        setErroresCampo(porCampo);
        setError(e.message);
      } else if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError('Error inesperado.');
      }
    } finally {
      setEnviando(false);
    }
  }

  if (cargando) {
    return <div className={styles.pagina}><p className={styles.cargando}>Cargando…</p></div>;
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>{editando ? 'Editar comunidad' : 'Registrar comunidad'}</h1>
        <p className={styles.subtitulo}>
          {editando
            ? 'Actualiza el perfil público de tu comunidad.'
            : 'Publica el perfil de tu comunidad estudiantil en el catálogo.'}
        </p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}
      {exito && (
        <div className={styles.mensajeExito}>
          {exito}{' '}
          <button
            type="button"
            className={styles.enlaceVerCatalogo}
            onClick={() => navigate('/comunidades')}
          >
            Ver catálogo
          </button>
        </div>
      )}

      <form className={styles.tarjeta} onSubmit={handleSubmit} noValidate>
        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="nombre">Nombre *</label>
          <input
            id="nombre"
            className={styles.input}
            type="text"
            value={form.nombre}
            onChange={(e) => actualizarCampo('nombre', e.target.value)}
          />
          {erroresCampo.nombre && <p className={styles.errorCampo}>{erroresCampo.nombre}</p>}
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="categoria">Categoría *</label>
            <select
              id="categoria"
              className={styles.input}
              value={form.categoria}
              onChange={(e) => actualizarCampo('categoria', e.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              <option value="Técnica">Técnica</option>
              <option value="Cultural">Cultural</option>
              <option value="Deportiva">Deportiva</option>
              <option value="Social">Social</option>
            </select>
            {erroresCampo.categoria && <p className={styles.errorCampo}>{erroresCampo.categoria}</p>}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="facultad">Facultad *</label>
            <select
              id="facultad"
              className={styles.input}
              value={form.facultad}
              onChange={(e) => actualizarCampo('facultad', e.target.value)}
            >
              <option value="">Selecciona una facultad</option>
              <option value="FIEC">FIEC</option>
              <option value="FCNM">FCNM</option>
              <option value="FIMCP">FIMCP</option>
              <option value="FCV">FCV</option>
              <option value="FCSH">FCSH</option>
              <option value="FADCOM">FADCOM</option>
              <option value="FICT">FICT</option>
            </select>
            {erroresCampo.facultad && <p className={styles.errorCampo}>{erroresCampo.facultad}</p>}
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="descripcion">Descripción *</label>
          <textarea
            id="descripcion"
            className={styles.textarea}
            rows={3}
            value={form.descripcion}
            onChange={(e) => actualizarCampo('descripcion', e.target.value)}
            placeholder="A qué se dedica la comunidad y qué tipo de actividades realiza."
          />
          {erroresCampo.descripcion && <p className={styles.errorCampo}>{erroresCampo.descripcion}</p>}
        </div>

        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="mision">Misión</label>
          <textarea
            id="mision"
            className={styles.textarea}
            rows={3}
            value={form.mision}
            onChange={(e) => actualizarCampo('mision', e.target.value)}
          />
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="logo_url">Logo (URL)</label>
            <input
              id="logo_url"
              className={styles.input}
              type="text"
              value={form.logo_url}
              onChange={(e) => actualizarCampo('logo_url', e.target.value)}
              placeholder="https://…"
            />
            {erroresCampo.logo_url && <p className={styles.errorCampo}>{erroresCampo.logo_url}</p>}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="fecha_fundacion">Fecha de fundación</label>
            <input
              id="fecha_fundacion"
              className={styles.input}
              type="date"
              value={form.fecha_fundacion}
              onChange={(e) => actualizarCampo('fecha_fundacion', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="correo_contacto">Correo de contacto</label>
            <input
              id="correo_contacto"
              className={styles.input}
              type="text"
              value={form.correo_contacto}
              onChange={(e) => actualizarCampo('correo_contacto', e.target.value)}
            />
            {erroresCampo.correo_contacto && <p className={styles.errorCampo}>{erroresCampo.correo_contacto}</p>}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="instagram">Instagram</label>
            <input
              id="instagram"
              className={styles.input}
              type="text"
              value={form.instagram}
              onChange={(e) => actualizarCampo('instagram', e.target.value)}
              placeholder="@usuario"
            />
          </div>
        </div>

        {editando && (
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
            />
            Comunidad activa (visible en el catálogo público)
          </label>
        )}

        <button className={styles.btnPrimario} type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Registrar comunidad'}
        </button>
      </form>
    </div>
  );
}
