import { PaginaPendiente } from '../components/PaginaPendiente';

export function AuditoriaPage() {
  return (
    <PaginaPendiente
      titulo="Auditoría"
      historias={['HU-20']}
      descripcion="Historial de ejecuciones y acciones de los usuarios."
    />
  );
}
