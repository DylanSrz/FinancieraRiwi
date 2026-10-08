import { PaginaPendiente } from '../components/PaginaPendiente';

export function PeriodosPage() {
  return (
    <PaginaPendiente
      titulo="Liquidación"
      historias={['HU-17', 'HU-18', 'HU-19']}
      descripcion="Periodos con su estado (ABIERTO, CALCULADO, CERRADO), liquidar ahora, reliquidar y cerrar."
    />
  );
}
