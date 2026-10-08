import { env } from '../config/env';

/**
 * Cliente HTTP de la API.
 * - Adjunta el access token (en memoria, nunca en localStorage).
 * - Si la API responde 401, intenta una sola vez renovar la sesión con el refresh token
 *   (cookie httpOnly) y repite la petición (HU-05).
 */

let accessToken: string | null = null;
let onSesionExpirada: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function alExpirarSesion(callback: () => void) {
  onSesionExpirada = callback;
}

export class ApiError extends Error {
  readonly status: number;
  readonly detalle: unknown;

  constructor(status: number, mensaje: string, detalle?: unknown) {
    super(mensaje);
    this.status = status;
    this.detalle = detalle;
  }
}

async function refrescar(): Promise<boolean> {
  const res = await fetch(`${env.apiUrl}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) return false;
  const { accessToken: nuevo } = (await res.json()) as { accessToken: string };
  setAccessToken(nuevo);
  return true;
}

export async function api<T>(ruta: string, init: RequestInit = {}, reintento = true): Promise<T> {
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  if (init.body && !(init.body instanceof FormData))
    headers.set('Content-Type', 'application/json');

  const res = await fetch(`${env.apiUrl}${ruta}`, { ...init, headers, credentials: 'include' });

  if (res.status === 401 && reintento && !ruta.startsWith('/auth/')) {
    if (await refrescar()) return api<T>(ruta, init, false);
    setAccessToken(null);
    onSesionExpirada?.();
  }

  if (!res.ok) {
    const cuerpo = (await res.json().catch(() => ({}))) as { message?: string | string[] };
    const mensaje = Array.isArray(cuerpo.message) ? cuerpo.message.join(', ') : cuerpo.message;
    throw new ApiError(res.status, mensaje ?? res.statusText, cuerpo);
  }

  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}
