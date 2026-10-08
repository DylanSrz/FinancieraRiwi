# ADR-004 · Autenticación nativa + Google con JWT y refresh token rotativo

| | |
|---|---|
| **Estado** | Aceptada |
| **Fecha** | 2026-10-07 |
| **Decisores** | @DylanSrz, @Kerin0011 |
| **Issue** | #44 (T-09) · HU-01 a HU-06 |

## Contexto

Requisitos de autenticación:

- La aplicación debe tener **autenticación propia** con correo y contraseña, y también **Google**, usando **JWT**.
- Los datos de nómina son sensibles (Ley 1581 de 2012), así que no cualquiera puede registrarse.
- El frontend (Vercel) y la API (Render) están en dominios distintos.

## Opciones consideradas

1. **Supabase Auth o Auth0:**
   - (+) Menos código.
   - (−) No cumple el requisito de autenticación nativa.
   - (−) Dependencia externa.
2. **JWT en `localStorage`:**
   - (−) Expuesto a robo por XSS.
3. **Access token JWT corto en memoria + refresh token opaco en cookie `httpOnly`:**
   - (+) Buena práctica de seguridad.
   - (−) Requiere manejar la rotación de tokens.

## Decisión

- **Registro solo por invitación:**
  - Un `ADMIN` invita a un usuario con correo y rol.
  - El invitado activa su cuenta definiendo la contraseña con un token de un solo uso (48 h). Esto también verifica el correo.
  - No existe registro público.
- **Login con Google** (`passport-google-oauth20`): solo para correos ya invitados. Se vincula `googleId` en el primer acceso.
- **Access token:**
  - JWT HS256 de 15 minutos, con `{ sub, empresaId, email, rol }`.
  - El frontend lo guarda **solo en memoria**.
- **Refresh token:**
  - Valor aleatorio de 256 bits con 7 días de vida. Se guarda únicamente su hash SHA-256.
  - Viaja en una cookie `httpOnly; Secure; SameSite=Strict; Path=/api/auth`.
  - **Rotación** en cada uso, con **familias**: si se reutiliza un token revocado, se revoca toda la familia.
- **Mismo origen:**
  - Vercel reenvía `/api/*` a Render, así la cookie es *first-party* (ADR-008).
  - El callback de Google también pasa por el dominio de Vercel.
- **Contraseñas:**
  - bcrypt con costo 12.
  - Política: 8 o más caracteres, una mayúscula y un número.
  - 5 intentos fallidos bloquean la cuenta 15 minutos.
  - Límite de peticiones en `/auth/login`.

## Consecuencias

- **Tablas:** `usuarios`, `refresh_tokens` y `tokens_accion` (invitación y recuperación).
- **Al recargar:** el frontend llama a `/auth/refresh` para recuperar la sesión.
- **Configuración:** las URIs de redirección de Google deben incluir el dominio de Vercel y `localhost`.
