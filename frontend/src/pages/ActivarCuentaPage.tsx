import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Alerta } from '../components/Alerta';
import { api } from '../lib/api';

const REGLAS = [
  { texto: '8 o más caracteres', cumple: (c: string) => c.length >= 8 },
  { texto: 'Una mayúscula', cumple: (c: string) => /[A-Z]/.test(c) },
  { texto: 'Un número', cumple: (c: string) => /\d/.test(c) },
];

/** HU-01: el invitado define su contraseña desde el enlace del correo. */
export function ActivarCuentaPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [clave, setClave] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const valida = REGLAS.every((r) => r.cumple(clave)) && clave === confirmacion;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await api('/auth/activar', {
        method: 'POST',
        body: JSON.stringify({ token, password: clave }),
      });
      setListo(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible activar la cuenta');
    } finally {
      setEnviando(false);
    }
  }

  if (!token) return <Alerta>El enlace de activación no es válido.</Alerta>;

  if (listo) {
    return (
      <>
        <h1>¡Cuenta activada!</h1>
        <Alerta tipo="exito">
          Ya puedes iniciar sesión con tu correo y la contraseña que definiste.
        </Alerta>
        <Link className="boton" to="/login">
          Iniciar sesión
        </Link>
      </>
    );
  }

  return (
    <>
      <h1>Activa tu cuenta</h1>
      <p className="texto-suave">Define la contraseña con la que vas a ingresar.</p>
      <form className="formulario" onSubmit={(e) => void onSubmit(e)}>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete="new-password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar contraseña
          <input
            type="password"
            autoComplete="new-password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
          />
        </label>
        <ul className="reglas">
          {REGLAS.map((r) => (
            <li key={r.texto} className={r.cumple(clave) ? 'cumple' : ''}>
              {r.cumple(clave) ? '✓' : '○'} {r.texto}
            </li>
          ))}
          <li className={clave && clave === confirmacion ? 'cumple' : ''}>
            {clave && clave === confirmacion ? '✓' : '○'} Las contraseñas coinciden
          </li>
        </ul>
        {error && <Alerta>{error}</Alerta>}
        <button type="submit" disabled={!valida || enviando}>
          {enviando ? 'Activando…' : 'Activar cuenta'}
        </button>
      </form>
    </>
  );
}
