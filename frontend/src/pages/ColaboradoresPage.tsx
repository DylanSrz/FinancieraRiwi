import { PaginaPendiente } from '../components/PaginaPendiente';

export function ColaboradoresPage() {
  return (
    <PaginaPendiente
      titulo="Colaboradores"
      historias={['HU-09', 'HU-10']}
      descripcion="Listado con búsqueda y filtros por rol y estado; crear, editar y desactivar colaboradores."
    />
  );
}
