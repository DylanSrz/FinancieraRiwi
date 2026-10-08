/** Configuración pública del frontend (variables VITE_*). */
export const env = {
  /** En producción es `/api`: Vercel reenvía las peticiones a Render (mismo origen → cookies seguras). */
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
} as const;
