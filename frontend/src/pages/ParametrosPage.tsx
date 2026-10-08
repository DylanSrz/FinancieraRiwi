import { PaginaPendiente } from '../components/PaginaPendiente';

export function ParametrosPage() {
  return (
    <PaginaPendiente
      titulo="Parámetros"
      historias={['HU-21', 'HU-22']}
      descripcion="Parámetros legales por año (SMMLV, auxilio, porcentajes) y valor hora por rol con vigencia."
    />
  );
}
