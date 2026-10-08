import { createBrowserRouter } from 'react-router';
import { RequireAuth } from '../auth/RequireAuth';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ActivarCuentaPage } from '../pages/ActivarCuentaPage';
import { AuditoriaPage } from '../pages/AuditoriaPage';
import { ColaboradoresPage } from '../pages/ColaboradoresPage';
import { ImportarColaboradoresPage } from '../pages/ImportarColaboradoresPage';
import { LoginPage } from '../pages/LoginPage';
import { NoEncontradaPage } from '../pages/NoEncontradaPage';
import { PanelPage } from '../pages/PanelPage';
import { ParametrosPage } from '../pages/ParametrosPage';
import { PeriodoDetallePage } from '../pages/PeriodoDetallePage';
import { PeriodosPage } from '../pages/PeriodosPage';
import { RecuperarPage } from '../pages/RecuperarPage';
import { UsuariosPage } from '../pages/UsuariosPage';

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/activar', element: <ActivarCuentaPage /> },
      { path: '/recuperar', element: <RecuperarPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <PanelPage /> },
          { path: '/colaboradores', element: <ColaboradoresPage /> },
          { path: '/colaboradores/importar', element: <ImportarColaboradoresPage /> },
          { path: '/periodos', element: <PeriodosPage /> },
          { path: '/periodos/:id', element: <PeriodoDetallePage /> },
          { path: '/parametros', element: <ParametrosPage /> },
          {
            element: <RequireAuth roles={['ADMIN']} />,
            children: [
              { path: '/usuarios', element: <UsuariosPage /> },
              { path: '/auditoria', element: <AuditoriaPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NoEncontradaPage /> },
]);
