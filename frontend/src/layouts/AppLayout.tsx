import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../auth/useAuth';
import { NOMBRE_ROL_USUARIO } from '../lib/formato';

const MENU = [
  { a: '/', texto: 'Panel', fin: true },
  { a: '/colaboradores', texto: 'Colaboradores' },
  { a: '/simulador', texto: 'Simulador' },
  { a: '/periodos', texto: 'Liquidación' },
  { a: '/parametros', texto: 'Parámetros' },
  { a: '/usuarios', texto: 'Usuarios', soloAdmin: true },
  { a: '/auditoria', texto: 'Auditoría', soloAdmin: true },
];

export function AppLayout() {
  const { usuario, logout } = useAuth();
  const esAdmin = usuario?.rol === 'ADMIN' || !usuario;

  return (
    <div className="app">
      <aside className="app__menu">
        <div className="marca">Nómina Riwi</div>
        <nav>
          {MENU.filter((m) => !m.soloAdmin || esAdmin).map((m) => (
            <NavLink key={m.a} to={m.a} end={m.fin}>
              {m.texto}
            </NavLink>
          ))}
        </nav>
        {usuario && (
          <div className="app__usuario">
            <strong>{usuario.nombre}</strong>
            <span>{usuario.email}</span>
            <span>{NOMBRE_ROL_USUARIO[usuario.rol]}</span>
            <button type="button" className="boton-secundario" onClick={() => void logout()}>
              Cerrar sesión
            </button>
          </div>
        )}
      </aside>
      <main className="app__contenido">
        <Outlet />
      </main>
    </div>
  );
}
