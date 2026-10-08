import { PaginaPendiente } from '../components/PaginaPendiente';

export function ActivarCuentaPage() {
  return (
    <PaginaPendiente
      titulo="Activar cuenta"
      historias={['HU-01']}
      descripcion="Definir contraseña desde el enlace de invitación recibido por correo."
    />
  );
}
