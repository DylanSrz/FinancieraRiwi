import { useState, type FormEvent } from 'react';
import { api } from '../lib/api';
import { NOMBRE_ROL_COLABORADOR } from '../lib/formato';
import { ROLES_COLABORADOR, type Colaborador } from '../lib/tipos';
import { Alerta } from './Alerta';

interface Props {
  colaborador?: Colaborador;
  onGuardado: (colaborador: Colaborador) => void;
  onCancelar: () => void;
}

/** HU-09: mismas validaciones que una fila del CSV (RN-19). */
export function ColaboradorFormulario({ colaborador, onGuardado, onCancelar }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const cuerpo = {
      nombres: String(f.get('nombres')),
      apellidos: String(f.get('apellidos')),
      email: String(f.get('email')),
      rol: String(f.get('rol')),
      edad: Number(f.get('edad')),
      hijos: Number(f.get('hijos')),
      claseRiesgoArl: Number(f.get('claseRiesgoArl')),
    };
    setError(null);
    setEnviando(true);
    try {
      const guardado = await api<Colaborador>(
        colaborador ? `/colaboradores/${colaborador.id}` : '/colaboradores',
        {
          method: colaborador ? 'PATCH' : 'POST',
          body: JSON.stringify(cuerpo),
        },
      );
      onGuardado(guardado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible guardar');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={(e) => void onSubmit(e)}>
      <div className="formulario__fila">
        <label>
          Nombres
          <input
            name="nombres"
            defaultValue={colaborador?.nombres}
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        <label>
          Apellidos
          <input
            name="apellidos"
            defaultValue={colaborador?.apellidos}
            required
            minLength={2}
            maxLength={100}
          />
        </label>
      </div>
      <label>
        Email
        <input name="email" type="email" defaultValue={colaborador?.email} required />
      </label>
      <div className="formulario__fila">
        <label>
          Rol
          <select name="rol" defaultValue={colaborador?.rol ?? 'OPERARIO'}>
            {ROLES_COLABORADOR.map((r) => (
              <option key={r} value={r}>
                {NOMBRE_ROL_COLABORADOR[r]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Clase de riesgo ARL
          <select name="claseRiesgoArl" defaultValue={colaborador?.claseRiesgoArl ?? 1}>
            {[1, 2, 3, 4, 5].map((c) => (
              <option key={c} value={c}>
                Clase {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="formulario__fila">
        <label>
          Edad
          <input
            name="edad"
            type="number"
            min={18}
            max={100}
            defaultValue={colaborador?.edad}
            required
          />
        </label>
        <label>
          Hijos
          <input
            name="hijos"
            type="number"
            min={0}
            step={1}
            defaultValue={colaborador?.hijos ?? 0}
            required
          />
        </label>
      </div>
      {error && <Alerta>{error}</Alerta>}
      <div className="acciones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
