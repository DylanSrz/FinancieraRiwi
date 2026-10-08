import { PaginaPendiente } from '../components/PaginaPendiente';

export function ImportarColaboradoresPage() {
  return (
    <PaginaPendiente
      titulo="Importar colaboradores"
      historias={['HU-07', 'HU-08']}
      descripcion="Cargar CSV, ver la vista previa con errores por fila, descargar el reporte de errores y confirmar."
    />
  );
}
