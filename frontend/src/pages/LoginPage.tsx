import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { env } from '../config/env';

/** HU-02 (correo y contraseña) y HU-03 (Google). */
export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setError(null);
    setEnviando(true);
    try {
      await login(String(datos.get('email')), String(datos.get('password')));
      const desde = (location.state as { desde?: string } | null)?.desde ?? '/';
      navigate(desde, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible iniciar sesión');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <h1>Iniciar sesión</h1>
      <form className="formulario" onSubmit={(e) => void onSubmit(e)}>
        <label>
          Correo
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <a className="boton-secundario" href={`${env.apiUrl}/auth/google`}>
        Continuar con Google
      </a>
      <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
    </>
  );
}
