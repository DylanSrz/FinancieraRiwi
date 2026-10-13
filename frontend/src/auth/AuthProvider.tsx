import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { alExpirarSesion, api, setAccessToken } from '../lib/api';
import { AuthContext, type Usuario } from './auth-context';

/**
 * Estado de sesión (HU-02, HU-05). Al cargar la app intenta recuperar la sesión con el
 * refresh token (cookie httpOnly); así también se completa el login con Google (HU-03).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuario = useCallback(async () => {
    setUsuario(await api<Usuario>('/auth/me'));
  }, []);

  useEffect(() => {
    alExpirarSesion(() => setUsuario(null));
    api<{ accessToken: string }>('/auth/refresh', { method: 'POST' })
      .then(({ accessToken }) => {
        setAccessToken(accessToken);
        return cargarUsuario();
      })
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false));
  }, [cargarUsuario]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { accessToken } = await api<{ accessToken: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(accessToken);
      await cargarUsuario();
    },
    [cargarUsuario],
  );

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => undefined);
    setAccessToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, cargando, login, logout }),
    [usuario, cargando, login, logout],
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
