import { PaginaPendiente } from '../components/PaginaPendiente';

export function PeriodoDetallePage() {
  return (
    <PaginaPendiente
      titulo="Detalle del periodo"
      historias={['HU-11', 'HU-23', 'HU-24', 'HU-25']}
      descripcion="Horas del periodo, liquidación por colaborador, exportar a CSV/PDF y enviar desprendibles."
    />
  );
}
