import { PaginaPendiente } from '../components/PaginaPendiente';

export function RecuperarPage() {
  return (
    <PaginaPendiente
      titulo="Recuperar contraseña"
      historias={['HU-04']}
      descripcion="Solicitar enlace de recuperación y definir una nueva contraseña."
    />
  );
}
