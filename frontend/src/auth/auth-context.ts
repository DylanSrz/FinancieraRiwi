import { createContext } from 'react';

export type RolUsuario = 'ADMIN' | 'AUX_CONTABLE';

export interface Usuario {
  sub: string;
  email: string;
  rol: RolUsuario;
  empresaId: string;
}

export interface AuthContextValue {
  usuario: Usuario | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
