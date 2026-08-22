import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { crearActividad } from '../../services/actividades';
import { ApiError } from '../../api/client';
import type { ActividadFormData } from '../../types';
import styles from './RegistrarActividad.module.css';

const FORM_VACIO: ActividadFormData = {
  titulo: '',
  tipo: '',
  fecha: '',
  lugar: '',
  descripcion: '',
};

function validar(datos: ActividadFormData): Record<string, string> {
  const errores: Record<string, string> = {};
  if (!datos.titulo.trim()) errores.titulo = 'El título de la actividad es obligatorio.';
  if (!datos.tipo) errores.tipo = 'Debe indicar el tipo de actividad.';
  if (!datos.fecha) errores.fecha = 'Debe indicar la fecha de la actividad.';
  if (!datos.lugar.trim()) errores.lugar = 'Debe indicar el lugar de la actividad.';
  return errores;
}

export default function RegistrarActividad() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const comunidadesLideradas = user?.comunidades_lideradas ?? [];
  const [comunidadId, setComunidadId] = useState<number | null>(null);

  const [form, setForm] = useState<ActividadFormData>(FORM_VACIO);
  const [erroresCampo, setErroresCampo] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  useEffect(() => {
    if (comunidadId === null && comunidadesLideradas.length > 0) {
      setComunidadId(comunidadesLideradas[0].id);
    }
  }, [comunidadesLideradas, comunidadId]);

  function actualizarCampo<K extends keyof ActividadFormData>(campo: K, valor: ActividadFormData[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!comunidadId) {
      setError('No lideras ninguna comunidad activa para registrar actividades.');
      return;
    }

    const erroresCliente = validar(form);
    setErroresCampo(erroresCliente);
    if (Object.keys(erroresCliente).length > 0) return;

    setEnviando(true);
    setError(null);
    setExito(null);

    try {
      const res = await crearActividad(comunidadId, form);
      setExito(res.message);
      setForm(FORM_VACIO);
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
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

  return (
    <div className={styles.pagina}>
      <header className={styles.encabezado}>
        <h1 className={styles.titulo}>Registrar actividad</h1>
        <p className={styles.subtitulo}>
          Registra el evento y la asistencia de tu comunidad.
        </p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}
      {exito && (
        <div className={styles.mensajeExito}>
          {exito}{' '}
          <button
            type="button"
            className={styles.enlaceVerHistorial}
            onClick={() => comunidadId && navigate(`/comunidades/${comunidadId}/actividades`)}
          >
            Ver historial
          </button>
        </div>
      )}

      <form className={styles.tarjeta} onSubmit={handleSubmit} noValidate>
        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="comunidad">Comunidad *</label>
          <select
            id="comunidad"
            className={styles.input}
            value={comunidadId ?? ''}
            onChange={(e) => setComunidadId(Number(e.target.value))}
          >
            {comunidadesLideradas.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          
          <label className={styles.etiqueta} htmlFor="titulo">Título *</label>
          <input
            id="titulo"
            className={styles.input}
            type="text"
            value={form.titulo}
            onChange={(e) => actualizarCampo('titulo', e.target.value)}
          />
          {erroresCampo.titulo && <p className={styles.errorCampo}>{erroresCampo.titulo}</p>}
        </div>

        <div className={styles.fila}>
          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="tipo">Tipo *</label>
            <select
              id="tipo"
              className={styles.input}
              value={form.tipo}
              onChange={(e) => actualizarCampo('tipo', e.target.value as ActividadFormData['tipo'])}
            >
              <option value="">Selecciona un tipo</option>
              <option value="reunion">Reunión</option>
              <option value="taller">Taller</option>
              <option value="charla">Charla</option>
              <option value="evento_social">Evento social</option>
              <option value="otro">Otro</option>
            </select>
            {erroresCampo.tipo && <p className={styles.errorCampo}>{erroresCampo.tipo}</p>}
          </div>

          <div className={styles.campo}>
            <label className={styles.etiqueta} htmlFor="fecha">Fecha *</label>
            <input
              id="fecha"
              className={styles.input}
              type="date"
              value={form.fecha}
              onChange={(e) => actualizarCampo('fecha', e.target.value)}
            />
            {erroresCampo.fecha && <p className={styles.errorCampo}>{erroresCampo.fecha}</p>}
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="lugar">Lugar *</label>
          <input
            id="lugar"
            className={styles.input}
            type="text"
            value={form.lugar}
            onChange={(e) => actualizarCampo('lugar', e.target.value)}
          />
          {erroresCampo.lugar && <p className={styles.errorCampo}>{erroresCampo.lugar}</p>}
        </div>

        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            className={styles.textarea}
            rows={4}
            value={form.descripcion}
            onChange={(e) => actualizarCampo('descripcion', e.target.value)}
            placeholder="Qué se hizo, quién lo dirigió y cuál fue el resultado."
          />
        </div>

        <button className={styles.btnPrimario} type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar actividad'}
        </button>
      </form>
    </div>
  );
}
