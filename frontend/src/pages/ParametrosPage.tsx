import { useState, type FormEvent } from 'react';
import { Alerta } from '../components/Alerta';
import { Modal } from '../components/Modal';
import { useAuth } from '../auth/useAuth';
import { useCarga } from '../hooks/useCarga';
import { api } from '../lib/api';
import { fecha, NOMBRE_ROL_COLABORADOR, pesos, porcentaje } from '../lib/formato';
import {
  ROLES_COLABORADOR,
  type Bonificacion,
  type ParametrosLegales,
  type ValoresHora,
} from '../lib/tipos';

const CAMPOS_MONTO = [
  ['smmlv', 'Salario mínimo (SMMLV)'],
  ['auxilioTransporte', 'Auxilio de transporte'],
] as const;

const CAMPOS_PORCENTAJE = [
  ['saludEmpleado', 'Salud colaborador'],
  ['pensionEmpleado', 'Pensión colaborador'],
  ['saludEmpleador', 'Salud empleador'],
  ['pensionEmpleador', 'Pensión empleador'],
  ['cajaCompensacion', 'Caja de compensación'],
  ['icbf', 'ICBF'],
  ['sena', 'SENA'],
] as const;

const CAMPOS_OTROS = [
  ['topeAuxilioSmmlv', 'Tope auxilio (SMMLV)'],
  ['topeExoneracionSmmlv', 'Tope exoneración (SMMLV)'],
  ['horasMaxMes', 'Máximo de horas al mes'],
] as const;

/** HU-21 (parámetros legales por año) y HU-22 (valor hora por rol con vigencia). */
export function ParametrosPage() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'ADMIN';
  const [anioActual] = useState(() => new Date().getFullYear());
  const [anio, setAnio] = useState(anioActual);
  const [editandoLegales, setEditandoLegales] = useState(false);
  const [nuevoValor, setNuevoValor] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const anios = useCarga(() => api<number[]>('/parametros/legales'));
  const legales = useCarga(() => api<ParametrosLegales>(`/parametros/legales/${anio}`), [anio]);
  const valores = useCarga(() => api<ValoresHora>('/parametros/valores-hora'));
  const bonificaciones = useCarga(() => api<Bonificacion[]>('/parametros/bonificaciones-hijos'));
  // Plantilla para registrar un año nuevo: los valores del año más reciente configurado.
  const ultimoAnio = anios.datos?.[0];
  const plantilla = useCarga(
    () =>
      ultimoAnio
        ? api<ParametrosLegales>(`/parametros/legales/${ultimoAnio}`)
        : Promise.resolve(null),
    [ultimoAnio],
  );

  const opcionesAnio = Array.from(new Set([...(anios.datos ?? []), anio, anioActual + 1])).sort(
    (a, b) => b - a,
  );

  return (
    <section className="pagina">
      <header className="pagina__encabezado">
        <h1>Parámetros de nómina</h1>
        <label className="en-linea">
          Año
          <select value={anio} onChange={(e) => setAnio(Number(e.target.value))}>
            {opcionesAnio.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </header>
      {mensaje && <Alerta tipo="exito">{mensaje}</Alerta>}

      <div className="columnas">
        <div className="tarjeta">
          <header className="tarjeta__encabezado">
            <h2>Legales {anio}</h2>
            {esAdmin && (
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setEditandoLegales(true)}
              >
                {legales.datos ? 'Editar' : `Registrar ${anio}`}
              </button>
            )}
          </header>
          {legales.error && <Alerta tipo="aviso">{legales.error}</Alerta>}
          {legales.datos && (
            <table className="tabla tabla--conceptos">
              <tbody>
                {CAMPOS_MONTO.map(([k, t]) => (
                  <tr key={k}>
                    <th scope="row">{t}</th>
                    <td className="numero">{pesos(legales.datos![k])}</td>
                  </tr>
                ))}
                {CAMPOS_PORCENTAJE.map(([k, t]) => (
                  <tr key={k}>
                    <th scope="row">{t}</th>
                    <td className="numero">{porcentaje(legales.datos![k])}</td>
                  </tr>
                ))}
                {CAMPOS_OTROS.map(([k, t]) => (
                  <tr key={k}>
                    <th scope="row">{t}</th>
                    <td className="numero">{legales.datos![k]}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">Fondo de Solidaridad Pensional</th>
                  <td className="numero">
                    {legales.datos.fspTramos.map((t) => (
                      <div key={t.desdeSmmlv}>
                        {t.hastaSmmlv ? `${t.desdeSmmlv}–${t.hastaSmmlv}` : `≥ ${t.desdeSmmlv}`}{' '}
                        SMMLV: {porcentaje(t.tasa)}
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <th scope="row">ARL por clase de riesgo</th>
                  <td className="numero">
                    {Object.entries(legales.datos.arlTarifas).map(([c, t]) => (
                      <div key={c}>
                        Clase {c}: {porcentaje(t)}
                      </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div>
          <div className="tarjeta">
            <header className="tarjeta__encabezado">
              <h2>Valor hora por rol</h2>
              {esAdmin && (
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setNuevoValor(true)}
                >
                  + Nuevo valor
                </button>
              )}
            </header>
            {valores.datos && (
              <>
                <table className="tabla tabla--conceptos">
                  <tbody>
                    {valores.datos.vigentes.map((v) => (
                      <tr key={v.rol}>
                        <th scope="row">{NOMBRE_ROL_COLABORADOR[v.rol]}</th>
                        <td className="numero">
                          {v.valorHora ? pesos(v.valorHora) : '—'}{' '}
                          <span className="texto-suave">desde {fecha(v.vigenteDesde)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <details>
                  <summary>Histórico ({valores.datos.historico.length})</summary>
                  <table className="tabla">
                    <tbody>
                      {valores.datos.historico.map((h) => (
                        <tr key={h.id}>
                          <td>{NOMBRE_ROL_COLABORADOR[h.rol]}</td>
                          <td className="numero">{pesos(h.valorHora)}</td>
                          <td>desde {fecha(h.vigenteDesde)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </>
            )}
          </div>

          <div className="tarjeta">
            <h2>Bonificación por hijos</h2>
            <table className="tabla tabla--conceptos">
              <tbody>
                {bonificaciones.datos?.map((b) => (
                  <tr key={b.hijos}>
                    <th scope="row">
                      {b.hijos === 3 ? '3 o más hijos' : `${b.hijos} hijo${b.hijos > 1 ? 's' : ''}`}
                    </th>
                    <td className="numero">{pesos(b.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        titulo={`Parámetros legales ${anio}`}
        abierto={editandoLegales}
        onCerrar={() => setEditandoLegales(false)}
      >
        {editandoLegales && (
          <FormularioLegales
            anio={anio}
            base={legales.datos ?? plantilla.datos}
            esNuevo={!legales.datos}
            onCancelar={() => setEditandoLegales(false)}
            onGuardado={() => {
              setEditandoLegales(false);
              setMensaje(`Parámetros legales de ${anio} guardados.`);
              legales.recargar();
              anios.recargar();
            }}
          />
        )}
      </Modal>

      <Modal titulo="Nuevo valor hora" abierto={nuevoValor} onCerrar={() => setNuevoValor(false)}>
        {nuevoValor && (
          <FormularioValorHora
            onCancelar={() => setNuevoValor(false)}
            onGuardado={() => {
              setNuevoValor(false);
              setMensaje('Nuevo valor hora registrado.');
              valores.recargar();
            }}
          />
        )}
      </Modal>
    </section>
  );
}

function FormularioLegales({
  anio,
  base,
  esNuevo,
  onGuardado,
  onCancelar,
}: {
  anio: number;
  base: ParametrosLegales | null;
  esNuevo: boolean;
  onGuardado: () => void;
  onCancelar: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const numero = (k: string) => Number(f.get(k));
    const cuerpo = {
      ...Object.fromEntries([...CAMPOS_MONTO, ...CAMPOS_OTROS].map(([k]) => [k, numero(k)])),
      ...Object.fromEntries(CAMPOS_PORCENTAJE.map(([k]) => [k, numero(k) / 100])),
      fspTramos: base?.fspTramos ?? [],
      arlTarifas: base?.arlTarifas ?? {},
    };
    try {
      await api(`/parametros/legales/${anio}`, { method: 'PUT', body: JSON.stringify(cuerpo) });
      onGuardado();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible guardar');
    }
  }

  return (
    <form className="formulario" onSubmit={(e) => void onSubmit(e)}>
      {esNuevo && base && (
        <Alerta tipo="aviso">
          Valores precargados de {base.anio}, incluidos los tramos FSP y las tarifas ARL.
          Actualízalos con los decretos de {anio}.
        </Alerta>
      )}
      <div className="formulario__rejilla">
        {CAMPOS_MONTO.map(([k, t]) => (
          <label key={k}>
            {t} ($)
            <input name={k} type="number" min={0} step={1} defaultValue={base?.[k]} required />
          </label>
        ))}
        {CAMPOS_PORCENTAJE.map(([k, t]) => (
          <label key={k}>
            {t} (%)
            <input
              name={k}
              type="number"
              min={0}
              max={100}
              step="0.001"
              defaultValue={base ? +(base[k] * 100).toFixed(3) : undefined}
              required
            />
          </label>
        ))}
        {CAMPOS_OTROS.map(([k, t]) => (
          <label key={k}>
            {t}
            <input name={k} type="number" min={0} step="0.01" defaultValue={base?.[k]} required />
          </label>
        ))}
      </div>
      {error && <Alerta>{error}</Alerta>}
      <div className="acciones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}

function FormularioValorHora({
  onGuardado,
  onCancelar,
}: {
  onGuardado: () => void;
  onCancelar: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api('/parametros/valores-hora', {
        method: 'POST',
        body: JSON.stringify({
          rol: f.get('rol'),
          valorHora: Number(f.get('valorHora')),
          vigenteDesde: f.get('vigenteDesde'),
        }),
      });
      onGuardado();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible guardar');
    }
  }

  return (
    <form className="formulario" onSubmit={(e) => void onSubmit(e)}>
      <label>
        Rol
        <select name="rol">
          {ROLES_COLABORADOR.map((r) => (
            <option key={r} value={r}>
              {NOMBRE_ROL_COLABORADOR[r]}
            </option>
          ))}
        </select>
      </label>
      <label>
        Valor hora ($)
        <input name="valorHora" type="number" min={1} step={1} required />
      </label>
      <label>
        Vigente desde
        <input name="vigenteDesde" type="date" required />
      </label>
      <p className="texto-suave">
        Los periodos anteriores a esta fecha conservan el valor que tenían.
      </p>
      {error && <Alerta>{error}</Alerta>}
      <div className="acciones">
        <button type="button" className="boton-secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="submit">Guardar</button>
      </div>
    </form>
  );
}
