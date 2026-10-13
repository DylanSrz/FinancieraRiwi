import { useState, type FormEvent } from 'react';
import { Alerta } from '../components/Alerta';
import { api } from '../lib/api';
import { NOMBRE_ROL_COLABORADOR, pesos } from '../lib/formato';
import { ROLES_COLABORADOR, type ResultadoLiquidacion, type RolColaborador } from '../lib/tipos';

interface Respuesta {
  entrada: { fechaCorte: string };
  resultado: ResultadoLiquidacion;
}

const hoy = () => new Date().toISOString().slice(0, 10);

/** Simula la liquidación de un colaborador con los parámetros vigentes (HU-12 a HU-16). */
export function SimuladorPage() {
  const [rol, setRol] = useState<RolColaborador>('OPERARIO');
  const [horas, setHoras] = useState('168');
  const [hijos, setHijos] = useState('2');
  const [claseRiesgoArl, setClase] = useState('1');
  const [fechaCorte, setFechaCorte] = useState(hoy());
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function simular(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      setRespuesta(
        await api<Respuesta>('/liquidaciones/simular', {
          method: 'POST',
          body: JSON.stringify({
            rol,
            horas: Number(horas),
            hijos: Number(hijos),
            claseRiesgoArl: Number(claseRiesgoArl),
            fechaCorte,
          }),
        }),
      );
    } catch (err) {
      setRespuesta(null);
      setError(err instanceof Error ? err.message : 'No fue posible simular');
    }
  }

  const r = respuesta?.resultado;

  return (
    <section className="pagina">
      <header className="pagina__encabezado">
        <h1>Simulador de liquidación</h1>
        <div className="etiquetas">
          {['HU-12', 'HU-13', 'HU-14', 'HU-15'].map((hu) => (
            <span key={hu} className="etiqueta">
              {hu}
            </span>
          ))}
        </div>
      </header>
      <p className="pagina__descripcion">
        Calcula la liquidación de un colaborador con los parámetros vigentes a la fecha de corte. No
        guarda nada.
      </p>

      <div className="columnas">
        <form className="tarjeta formulario" onSubmit={(e) => void simular(e)}>
          <label>
            Rol
            <select value={rol} onChange={(e) => setRol(e.target.value as RolColaborador)}>
              {ROLES_COLABORADOR.map((r) => (
                <option key={r} value={r}>
                  {NOMBRE_ROL_COLABORADOR[r]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Horas trabajadas
            <input
              type="number"
              min={0}
              max={744}
              step="0.5"
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              required
            />
          </label>
          <label>
            Hijos
            <input
              type="number"
              min={0}
              step={1}
              value={hijos}
              onChange={(e) => setHijos(e.target.value)}
              required
            />
          </label>
          <label>
            Clase de riesgo ARL
            <select value={claseRiesgoArl} onChange={(e) => setClase(e.target.value)}>
              {[1, 2, 3, 4, 5].map((c) => (
                <option key={c} value={c}>
                  Clase {c}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fecha de corte
            <input
              type="date"
              value={fechaCorte}
              onChange={(e) => setFechaCorte(e.target.value)}
              required
            />
          </label>
          <button type="submit">Calcular</button>
          {error && <Alerta>{error}</Alerta>}
        </form>

        {r && (
          <div className="tarjeta" aria-live="polite">
            {r.alertas.map((a) => (
              <Alerta key={a} tipo="aviso">
                ⚠ {a}
              </Alerta>
            ))}
            <table className="tabla tabla--conceptos">
              <tbody>
                <Fila
                  concepto={`Devengado básico (${horas} h × ${pesos(r.valorHora)})`}
                  valor={r.devengadoBasico}
                />
                <Fila concepto={`Bonificación por hijos (${hijos})`} valor={r.bonificacionHijos} />
                <Fila concepto="Auxilio de transporte" valor={r.auxilioTransporte} />
                <Fila concepto="Total devengado" valor={r.totalDevengado} total />
                <Fila concepto="Salud (4 %)" valor={-r.saludEmpleado} />
                <Fila concepto="Pensión (4 %)" valor={-r.pensionEmpleado} />
                <Fila concepto="Fondo de Solidaridad Pensional" valor={-r.fsp} />
                <Fila concepto="Neto a pagar" valor={r.netoPagar} total destacado />
              </tbody>
            </table>
            <details>
              <summary>Costo para el empleador: {pesos(r.costoEmpleador)}</summary>
              <table className="tabla tabla--conceptos">
                <tbody>
                  <Fila concepto="Salud empleador" valor={r.saludEmpleador} />
                  <Fila concepto="Pensión empleador (12 %)" valor={r.pensionEmpleador} />
                  <Fila concepto="ARL" valor={r.arl} />
                  <Fila concepto="Caja de compensación (4 %)" valor={r.cajaCompensacion} />
                  <Fila concepto="ICBF" valor={r.icbf} />
                  <Fila concepto="SENA" valor={r.sena} />
                  <Fila concepto="Cesantías" valor={r.cesantias} />
                  <Fila concepto="Intereses sobre cesantías" valor={r.interesesCesantias} />
                  <Fila concepto="Prima de servicios" valor={r.prima} />
                  <Fila concepto="Vacaciones" valor={r.vacaciones} />
                </tbody>
              </table>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}

function Fila({
  concepto,
  valor,
  total,
  destacado,
}: {
  concepto: string;
  valor: number;
  total?: boolean;
  destacado?: boolean;
}) {
  return (
    <tr
      className={[total && 'fila-total', destacado && 'fila-destacada'].filter(Boolean).join(' ')}
    >
      <th scope="row">{concepto}</th>
      <td className="numero">{pesos(valor)}</td>
    </tr>
  );
}
