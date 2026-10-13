import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Alerta } from '../components/Alerta';
import { useAuth } from '../auth/useAuth';
import { env } from '../config/env';

const ERRORES_GOOGLE: Record<string, string> = {
  google: 'No fue posible iniciar sesión con Google. Intenta de nuevo.',
  'sin-acceso':
    'Tu cuenta de Google no tiene acceso a la plataforma. Pide una invitación al administrador.',
};

/** HU-02 (correo y contraseña) y HU-03 (Google). */
export function LoginPage() {
  const { login, usuario } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const [error, setError] = useState<string | null>(
    ERRORES_GOOGLE[params.get('error') ?? ''] ?? null,
  );
  const [enviando, setEnviando] = useState(false);
  const desde = (location.state as { desde?: string } | null)?.desde ?? '/';

  if (usuario) return <Navigate to={desde} replace />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setError(null);
    setEnviando(true);
    try {
      await login(String(datos.get('email')), String(datos.get('password')));
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
        {error && <Alerta>{error}</Alerta>}
        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <div className="separador">o</div>
      <a className="boton-secundario" href={`${env.apiUrl}/auth/google`}>
        Continuar con Google
      </a>
      <Link to="/recuperar">¿Olvidaste tu contraseña?</Link>
    </>
  );
}
