import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { useCarga } from '../hooks/useCarga';
import { api } from '../lib/api';
import { pesos } from '../lib/formato';
import type { Colaborador, Pagina, ParametrosLegales } from '../lib/tipos';

/** Resumen de inicio. El estado del periodo y la próxima ejecución llegan con HU-17/HU-23 (Sprint 2). */
export function PanelPage() {
  const { usuario } = useAuth();
  const [anio] = useState(() => new Date().getFullYear());
  const colaboradores = useCarga(() => api<Pagina<Colaborador>>('/colaboradores?porPagina=1'));
  const legales = useCarga(() => api<ParametrosLegales>(`/parametros/legales/${anio}`));

  return (
    <section className="pagina">
      <h1>Hola{usuario ? `, ${usuario.nombre.split(' ')[0]}` : ''} 👋</h1>
      <p className="pagina__descripcion">Liquidación de nómina de Financiera Riwi.</p>

      <div className="tarjetas">
        <Link className="tarjeta tarjeta--enlace" to="/colaboradores">
          <span className="tarjeta__dato">{colaboradores.datos?.total ?? '—'}</span>
          <span>colaboradores activos</span>
        </Link>
        <Link className="tarjeta tarjeta--enlace" to="/parametros">
          <span className="tarjeta__dato">{legales.datos ? pesos(legales.datos.smmlv) : '—'}</span>
          <span>salario mínimo {anio}</span>
        </Link>
        <Link className="tarjeta tarjeta--enlace" to="/simulador">
          <span className="tarjeta__dato">🧮</span>
          <span>simular una liquidación</span>
        </Link>
      </div>

      {legales.error && (
        <p className="alerta alerta--aviso">
          No hay parámetros legales para {anio}. <Link to="/parametros">Regístralos</Link> antes de
          liquidar.
        </p>
      )}
    </section>
  );
}
