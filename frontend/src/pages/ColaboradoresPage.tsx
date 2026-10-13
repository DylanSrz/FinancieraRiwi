import { useState } from 'react';
import { Link } from 'react-router';
import { Alerta } from '../components/Alerta';
import { ColaboradorFormulario } from '../components/ColaboradorFormulario';
import { Modal } from '../components/Modal';
import { Paginacion } from '../components/Paginacion';
import { useCarga } from '../hooks/useCarga';
import { api } from '../lib/api';
import { NOMBRE_ROL_COLABORADOR } from '../lib/formato';
import { ROLES_COLABORADOR, type Colaborador, type Pagina } from '../lib/tipos';

type Estado = 'activos' | 'inactivos' | 'todos';

/** HU-09 (crear/editar/desactivar) y HU-10 (listar y buscar). */
export function ColaboradoresPage() {
  const [q, setQ] = useState('');
  const [rol, setRol] = useState('');
  const [estado, setEstado] = useState<Estado>('activos');
  const [pagina, setPagina] = useState(1);
  const [editando, setEditando] = useState<Colaborador | 'nuevo' | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const consulta = new URLSearchParams({ estado, pagina: String(pagina), porPagina: '20' });
  if (q.trim()) consulta.set('q', q.trim());
  if (rol) consulta.set('rol', rol);
  const { datos, error, cargando, recargar } = useCarga(
    () => api<Pagina<Colaborador>>(`/colaboradores?${consulta.toString()}`),
    [consulta.toString()],
  );

  const filtrar =
    <T,>(setter: (v: T) => void) =>
    (valor: T) => {
      setter(valor);
      setPagina(1);
    };

  async function cambiarEstado(c: Colaborador) {
    const accion = c.activo ? 'desactivar' : 'reactivar';
    if (!window.confirm(`¿Seguro que quieres ${accion} a ${c.nombres} ${c.apellidos}?`)) return;
    await (c.activo
      ? api(`/colaboradores/${c.id}`, { method: 'DELETE' })
      : api(`/colaboradores/${c.id}`, { method: 'PATCH', body: JSON.stringify({ activo: true }) }));
    setMensaje(`${c.nombres} ${c.apellidos} quedó ${c.activo ? 'desactivado' : 'activo'}.`);
    recargar();
  }

  return (
    <section className="pagina">
      <header className="pagina__encabezado">
        <h1>Colaboradores</h1>
        <div className="acciones">
          <Link className="boton-secundario" to="/colaboradores/importar">
            ⬆ Importar CSV
          </Link>
          <button type="button" onClick={() => setEditando('nuevo')}>
            + Nuevo colaborador
          </button>
        </div>
      </header>

      <div className="filtros">
        <input
          type="search"
          placeholder="Buscar por nombre, apellido o email"
          aria-label="Buscar"
          value={q}
          onChange={(e) => filtrar(setQ)(e.target.value)}
        />
        <select aria-label="Rol" value={rol} onChange={(e) => filtrar(setRol)(e.target.value)}>
          <option value="">Todos los roles</option>
          {ROLES_COLABORADOR.map((r) => (
            <option key={r} value={r}>
              {NOMBRE_ROL_COLABORADOR[r]}
            </option>
          ))}
        </select>
        <select
          aria-label="Estado"
          value={estado}
          onChange={(e) => filtrar(setEstado)(e.target.value as Estado)}
        >
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
          <option value="todos">Todos</option>
        </select>
      </div>

      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}
      {error && <Alerta>{error}</Alerta>}

      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Email</th>
              <th className="numero">Edad</th>
              <th className="numero">Hijos</th>
              <th>Estado</th>
              <th aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {cargando && !datos && (
              <tr>
                <td colSpan={7}>Cargando…</td>
              </tr>
            )}
            {datos?.datos.length === 0 && (
              <tr>
                <td colSpan={7} className="vacio">
                  No hay colaboradores con esos filtros.{' '}
                  <Link to="/colaboradores/importar">Importa un CSV</Link> para empezar.
                </td>
              </tr>
            )}
            {datos?.datos.map((c) => (
              <tr key={c.id}>
                <td>
                  {c.nombres} {c.apellidos}
                </td>
                <td>{NOMBRE_ROL_COLABORADOR[c.rol]}</td>
                <td>{c.email}</td>
                <td className="numero">{c.edad}</td>
                <td className="numero">{c.hijos}</td>
                <td>
                  <span className={`chip ${c.activo ? 'chip--ok' : 'chip--off'}`}>
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="acciones-fila">
                  <button type="button" className="boton-enlace" onClick={() => setEditando(c)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="boton-enlace"
                    onClick={() => void cambiarEstado(c)}
                  >
                    {c.activo ? 'Desactivar' : 'Reactivar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {datos && <Paginacion {...datos} onCambiar={setPagina} />}

      <Modal
        titulo={editando === 'nuevo' ? 'Nuevo colaborador' : 'Editar colaborador'}
        abierto={editando !== null}
        onCerrar={() => setEditando(null)}
      >
        {editando !== null && (
          <ColaboradorFormulario
            colaborador={editando === 'nuevo' ? undefined : editando}
            onCancelar={() => setEditando(null)}
            onGuardado={(c) => {
              setMensaje(`${c.nombres} ${c.apellidos} quedó guardado.`);
              setEditando(null);
              recargar();
            }}
          />
        )}
      </Modal>
    </section>
  );
}
