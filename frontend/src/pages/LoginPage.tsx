import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import styles from './LoginPage.module.css';

interface LoginFormData {
  email: string;
  password: string;
}

interface UbicacionEstado {
  desde?: string;
}

const FORM_VACIO: LoginFormData = { email: '', password: '' };

function validar(datos: LoginFormData): Record<string, string> {
  const errores: Record<string, string> = {};

  if (!datos.email.trim()) {
    errores.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    errores.email = 'El correo no es válido.';
  }

  if (!datos.password) {
    errores.password = 'La contraseña es obligatoria.';
  } else if (datos.password.length < 8) {
    errores.password = 'La contraseña debe tener al menos 8 caracteres.';
  }

  return errores;
}

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState<LoginFormData>(FORM_VACIO);
  const [erroresCampo, setErroresCampo] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const destino = (location.state as UbicacionEstado | null)?.desde ?? '/comunidades';

  if (!loading && user) {
    return <Navigate to={destino} replace />;
  }

  function actualizarCampo<K extends keyof LoginFormData>(campo: K, valor: LoginFormData[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const erroresCliente = validar(form);
    setErroresCampo(erroresCliente);
    if (Object.keys(erroresCliente).length > 0) return;

    setEnviando(true);
    setError(null);

    try {
      await login(form.email, form.password);
      navigate(destino, { replace: true });
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        // Errores 422 de Laravel: { campo: ["mensaje"] }
        const porCampo: Record<string, string> = {};
        for (const [campo, mensajes] of Object.entries(e.errors)) {
          porCampo[campo] = mensajes[0];
        }
        setErroresCampo(porCampo);
        setError(porCampo.email ?? 'Credenciales incorrectas.');
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
        <h1 className={styles.titulo}>Iniciar sesión</h1>
        <p className={styles.subtitulo}>Accede con tu cuenta de ESPOL.</p>
      </header>

      {error && <div className={styles.mensajeError}>{error}</div>}

      <form className={styles.tarjeta} onSubmit={handleSubmit} noValidate>
        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="email">Correo *</label>
          <input
            id="email"
            className={styles.input}
            type="email"
            autoComplete="username"
            value={form.email}
            onChange={(e) => actualizarCampo('email', e.target.value)}
          />
          {erroresCampo.email && <p className={styles.errorCampo}>{erroresCampo.email}</p>}
        </div>

        <div className={styles.campo}>
          <label className={styles.etiqueta} htmlFor="password">Contraseña *</label>
          <input
            id="password"
            className={styles.input}
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => actualizarCampo('password', e.target.value)}
          />
          {erroresCampo.password && <p className={styles.errorCampo}>{erroresCampo.password}</p>}
        </div>

        <button className={styles.btnPrimario} type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>

        <p className={styles.ayuda}>
          Prueba con ana@espol.edu.ec, luis@espol.edu.ec o sofia@espol.edu.ec — contraseña: password
        </p>
      </form>
    </div>
  );
}
