import { PaginaPendiente } from '../components/PaginaPendiente';

export function PanelPage() {
  return (
    <PaginaPendiente
      titulo="Panel"
      historias={['HU-23', 'HU-20']}
      descripcion="Estado del periodo actual, próxima ejecución programada, totales del último periodo y alertas."
    />
  );
}
