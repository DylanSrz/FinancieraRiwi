import { useState, type FormEvent } from 'react';
import { Alerta } from '../components/Alerta';
import { Modal } from '../components/Modal';
import { useAuth } from '../auth/useAuth';
import { useCarga } from '../hooks/useCarga';
import { api } from '../lib/api';
import { fechaHora, NOMBRE_ROL_USUARIO } from '../lib/formato';
import type { UsuarioAdmin } from '../lib/tipos';

const ESTADOS: Record<UsuarioAdmin['estado'], { texto: string; clase: string }> = {
  ACTIVO: { texto: 'Activo', clase: 'chip--ok' },
  PENDIENTE: { texto: 'Pendiente', clase: 'chip--aviso' },
  INACTIVO: { texto: 'Inactivo', clase: 'chip--off' },
};

/** HU-01 (invitar) y HU-06 (gestionar usuarios y roles). Solo ADMIN. */
export function UsuariosPage() {
  const { usuario: yo } = useAuth();
  const { datos, error, recargar } = useCarga(() => api<UsuarioAdmin[]>('/usuarios'));
  const [invitando, setInvitando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  async function ejecutar(accion: () => Promise<unknown>, exito: string) {
    try {
      await accion();
      setMensaje({ tipo: 'exito', texto: exito });
      recargar();
    } catch (e) {
      setMensaje({
        tipo: 'error',
        texto: e instanceof Error ? e.message : 'No fue posible completar la acción',
      });
    }
  }

  const actualizar = (
    u: UsuarioAdmin,
    cambios: Partial<Pick<UsuarioAdmin, 'rol' | 'estado'>>,
    exito: string,
  ) =>
    ejecutar(
      () => api(`/usuarios/${u.id}`, { method: 'PATCH', body: JSON.stringify(cambios) }),
      exito,
    );

  return (
    <section className="pagina">
      <header className="pagina__encabezado">
        <h1>Usuarios</h1>
        <button type="button" onClick={() => setInvitando(true)}>
          + Invitar usuario
        </button>
      </header>
      <p className="pagina__descripcion">
        Solo las personas invitadas pueden ingresar. La invitación llega por correo y vence en 48
        horas.
      </p>
      {mensaje && <Alerta tipo={mensaje.tipo}>{mensaje.texto}</Alerta>}
      {error && <Alerta>{error}</Alerta>}

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {datos?.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.nombre} {u.id === yo?.id && <span className="texto-suave">(tú)</span>}
                </td>
                <td>
                  {u.email} {u.conGoogle && <span className="chip">Google</span>}
                </td>
                <td>
                  <select
                    aria-label={`Rol de ${u.nombre}`}
                    value={u.rol}
                    onChange={(e) =>
                      void actualizar(
                        u,
                        { rol: e.target.value as UsuarioAdmin['rol'] },
                        `Rol de ${u.nombre} actualizado.`,
                      )
                    }
                  >
                    {Object.entries(NOMBRE_ROL_USUARIO).map(([valor, texto]) => (
                      <option key={valor} value={valor}>
                        {texto}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <span className={`chip ${ESTADOS[u.estado].clase}`}>
                    {ESTADOS[u.estado].texto}
                  </span>
                </td>
                <td>{fechaHora(u.ultimoAcceso)}</td>
                <td className="acciones-fila">
                  {u.estado === 'PENDIENTE' && (
                    <button
                      type="button"
                      className="boton-enlace"
                      onClick={() =>
                        void ejecutar(
                          () => api(`/usuarios/${u.id}/reenviar-invitacion`, { method: 'POST' }),
                          `Invitación reenviada a ${u.email}.`,
                        )
                      }
                    >
                      Reenviar invitación
                    </button>
                  )}
                  {u.estado === 'ACTIVO' && u.id !== yo?.id && (
                    <button
                      type="button"
                      className="boton-enlace"
                      onClick={() =>
                        void actualizar(u, { estado: 'INACTIVO' }, `${u.nombre} fue desactivado.`)
                      }
                    >
                      Desactivar
                    </button>
                  )}
                  {u.estado === 'INACTIVO' && (
                    <button
                      type="button"
                      className="boton-enlace"
                      onClick={() =>
                        void actualizar(u, { estado: 'ACTIVO' }, `${u.nombre} fue reactivado.`)
                      }
                    >
                      Reactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal titulo="Invitar usuario" abierto={invitando} onCerrar={() => setInvitando(false)}>
        {invitando && (
          <FormularioInvitacion
            onCancelar={() => setInvitando(false)}
            onInvitado={(email) => {
              setInvitando(false);
              setMensaje({ tipo: 'exito', texto: `Invitación enviada a ${email}.` });
              recargar();
            }}
          />
        )}
      </Modal>
    </section>
  );
}

function FormularioInvitacion({
  onInvitado,
  onCancelar,
}: {
  onInvitado: (email: string) => void;
  onCancelar: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setEnviando(true);
    setError(null);
    try {
      const u = await api<UsuarioAdmin>('/usuarios/invitaciones', {
        method: 'POST',
        body: JSON.stringify({ nombre: f.get('nombre'), email: f.get('email'), rol: f.get('rol') }),
      });
      onInvitado(u.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible enviar la invitación');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={(e) => void onSubmit(e)}>
      <label>
        Nombre
        <input name="nombre" required minLength={3} />
      </label>
      <label>
        Correo
        <input name="email" type="email" required />
      </label>
      <label>
        Rol
        <select name="rol" defaultValue="AUX_CONTABLE">
          {Object.entries(NOMBRE_ROL_USUARIO).map(([valor, texto]) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      </label>
      {error && <Alerta>{error}</Alerta>}
      <div className="acciones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : 'Enviar invitación'}
        </button>
      </div>
    </form>
  );
}
