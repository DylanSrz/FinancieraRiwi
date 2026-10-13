import type { ReactNode } from 'react';

export function Alerta({
  tipo = 'error',
  children,
}: {
  tipo?: 'error' | 'exito' | 'aviso';
  children: ReactNode;
}) {
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={`alerta alerta--${tipo}`}>
      {children}
    </div>
  );
}
