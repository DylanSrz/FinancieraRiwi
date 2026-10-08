import { Navigate, Outlet, useLocation } from 'react-router';
import type { RolUsuario } from './auth-context';
import { useAuth } from './useAuth';

/**
 * Protege rutas privadas. Con VITE_DEMO_SIN_AUTH=true (solo desarrollo) se pueden navegar
 * las pantallas antes de que exista el login (Sprint 0).
 */
export function RequireAuth({ roles }: { roles?: RolUsuario[] }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (import.meta.env.DEV && import.meta.env.VITE_DEMO_SIN_AUTH === 'true') return <Outlet />;
  if (cargando) return <p className="cargando">Cargando…</p>;
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />;
  return <Outlet />;
}
