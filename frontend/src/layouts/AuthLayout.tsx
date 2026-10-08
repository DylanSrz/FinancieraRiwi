import { Outlet } from 'react-router';

export function AuthLayout() {
  return (
    <div className="auth">
      <div className="auth__tarjeta">
        <div className="marca">Nómina Riwi</div>
        <Outlet />
      </div>
    </div>
  );
}
