import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { AuthContext } from '../auth/auth-context';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('muestra el formulario y la opción de Google', () => {
    render(
      <AuthContext.Provider
        value={{ usuario: null, cargando: false, login: async () => {}, logout: async () => {} }}
      >
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continuar con Google' })).toHaveAttribute(
      'href',
      '/api/auth/google',
    );
  });
});
