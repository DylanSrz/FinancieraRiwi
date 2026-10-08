import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError, setAccessToken } from './api';

function respuesta(status: number, cuerpo: unknown = {}) {
  return new Response(JSON.stringify(cuerpo), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('api', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setAccessToken(null);
  });

  it('envía el access token en la cabecera Authorization', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(respuesta(200, { ok: true }));
    setAccessToken('token-123');

    await api('/colaboradores');

    const headers = fetchMock.mock.calls[0][1]?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer token-123');
  });

  it('renueva la sesión y repite la petición cuando recibe 401', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(respuesta(401))
      .mockResolvedValueOnce(respuesta(200, { accessToken: 'nuevo' }))
      .mockResolvedValueOnce(respuesta(200, { datos: 1 }));

    const resultado = await api<{ datos: number }>('/colaboradores');

    expect(resultado).toEqual({ datos: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1][0])).toContain('/auth/refresh');
  });

  it('lanza ApiError con el mensaje de la API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      respuesta(400, { message: ['email must be an email'] }),
    );

    const error = await api('/auth/login', { method: 'POST', body: '{}' }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 400, message: 'email must be an email' });
  });
});
