import { PaginaPendiente } from '../components/PaginaPendiente';

export function UsuariosPage() {
  return (
    <PaginaPendiente
      titulo="Usuarios"
      historias={['HU-01', 'HU-06']}
      descripcion="Invitar usuarios, cambiar rol y desactivar."
    />
  );
}
