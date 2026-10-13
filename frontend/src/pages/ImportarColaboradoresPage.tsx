import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { Alerta } from '../components/Alerta';
import { api } from '../lib/api';
import { NOMBRE_ROL_COLABORADOR } from '../lib/formato';
import { csvDeErrores, descargarCsv } from '../lib/csv';
import type { PrevisualizacionCsv, ResultadoImportacion } from '../lib/tipos';

const PLANTILLA = [
  'nombres,apellidos,rol,email,edad,hijos',
  'Ana María,Pérez Gómez,operario,ana.perez@financierariwi.com,29,2',
  'Carlos,Rodríguez Silva,gerente,carlos.rodriguez@financierariwi.com,45,0',
].join('\n');

/** HU-07 (importar) y HU-08 (validar y ver errores por fila). */
export function ImportarColaboradoresPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [vista, setVista] = useState<PrevisualizacionCsv | null>(null);
  const [resultado, setResultado] = useState<ResultadoImportacion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [procesando, setProcesando] = useState(false);

  const formulario = () => {
    const datos = new FormData();
    datos.append('archivo', archivo!);
    return datos;
  };

  async function previsualizar(e: FormEvent) {
    e.preventDefault();
    if (!archivo) return;
    setError(null);
    setResultado(null);
    setProcesando(true);
    try {
      setVista(
        await api<PrevisualizacionCsv>('/colaboradores/importaciones/previsualizar', {
          method: 'POST',
          body: formulario(),
        }),
      );
    } catch (err) {
      setVista(null);
      setError(err instanceof Error ? err.message : 'No fue posible leer el archivo');
    } finally {
      setProcesando(false);
    }
  }

  async function importar() {
    setProcesando(true);
    try {
      setResultado(
        await api<ResultadoImportacion>('/colaboradores/importaciones', {
          method: 'POST',
          body: formulario(),
        }),
      );
      setVista(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible importar');
    } finally {
      setProcesando(false);
    }
  }

  return (
    <section className="pagina">
      <header className="pagina__encabezado">
        <h1>Importar colaboradores</h1>
        <button
          type="button"
          className="boton-secundario"
          onClick={() => descargarCsv('plantilla-colaboradores.csv', PLANTILLA)}
        >
          Descargar plantilla CSV
        </button>
      </header>
      <p className="pagina__descripcion">
        Archivo CSV en UTF-8, separado por comas, con las columnas{' '}
        <code>nombres, apellidos, rol, email, edad, hijos</code>. Máximo 5 MB. Los colaboradores que
        ya existen se actualizan por email.
      </p>

      <form className="tarjeta subida" onSubmit={(e) => void previsualizar(e)}>
        <label>
          <span className="paso">Paso 1</span> Selecciona el archivo
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => {
              setArchivo(e.target.files?.[0] ?? null);
              setVista(null);
              setResultado(null);
            }}
          />
        </label>
        <button type="submit" disabled={!archivo || procesando}>
          {procesando && !vista ? 'Validando…' : 'Validar archivo'}
        </button>
      </form>

      {error && <Alerta>{error}</Alerta>}

      {resultado && (
        <Alerta tipo="exito">
          Importación completa: {resultado.creados} creados, {resultado.actualizados} actualizados y{' '}
          {resultado.rechazados} filas rechazadas.{' '}
          <Link to="/colaboradores">Ver colaboradores</Link>
        </Alerta>
      )}

      {vista && (
        <div className="tarjeta">
          <h2>
            <span className="paso">Paso 2</span> Vista previa
          </h2>
          <p className="resumen-importacion">
            <span className="chip chip--ok">✅ {vista.validas.length} válidas</span>
            <span className="chip chip--error">❌ {vista.invalidas.length} con errores</span>
            <span className="texto-suave">de {vista.total} filas</span>
          </p>

          {vista.invalidas.length > 0 && (
            <>
              <div className="tabla-contenedor">
                <table className="tabla">
                  <thead>
                    <tr>
                      <th className="numero">Fila</th>
                      <th>Email</th>
                      <th>Errores</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vista.invalidas.map((i) => (
                      <tr key={i.fila}>
                        <td className="numero">{i.fila}</td>
                        <td>{i.datos.email || '(vacío)'}</td>
                        <td>
                          <ul className="lista-errores">
                            {i.errores.map((e) => (
                              <li key={e}>{e}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="boton-secundario"
                onClick={() =>
                  descargarCsv('errores-importacion.csv', csvDeErrores(vista.invalidas))
                }
              >
                Descargar errores
              </button>
            </>
          )}

          {vista.validas.length > 0 && (
            <details>
              <summary>Ver filas válidas</summary>
              <div className="tabla-contenedor">
                <table className="tabla">
                  <thead>
                    <tr>
                      <th className="numero">Fila</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Email</th>
                      <th className="numero">Hijos</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vista.validas.map((v) => (
                      <tr key={v.fila}>
                        <td className="numero">{v.fila}</td>
                        <td>
                          {v.datos.nombres} {v.datos.apellidos}
                        </td>
                        <td>{NOMBRE_ROL_COLABORADOR[v.datos.rol]}</td>
                        <td>{v.datos.email}</td>
                        <td className="numero">{v.datos.hijos}</td>
                        <td>{v.accion === 'crear' ? 'Crear' : 'Actualizar'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}

          <div className="acciones">
            <span className="paso">Paso 3</span>
            <button type="button" className="boton-secundario" onClick={() => setVista(null)}>
              Cancelar
            </button>
            <button
              type="button"
              disabled={!vista.validas.length || procesando}
              onClick={() => void importar()}
            >
              {procesando ? 'Importando…' : `Importar ${vista.validas.length} colaboradores`}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
