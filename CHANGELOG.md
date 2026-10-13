# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versionado semántico.

## [0.1.0] — Sprint 1 · 2026-10-13

### Agregado
- **Motor de liquidación** (HU-12 a HU-15, y cálculo de HU-16):
  - Devengado por horas, bonificación por hijos y auxilio de transporte.
  - Salud, pensión y FSP.
  - Aportes del empleador, parafiscales con exoneración y provisiones.
  - Verificado con los casos CP-01 a CP-12.
- **Simulador de liquidación** (`POST /api/liquidaciones/simular` y pantalla *Simulador*). Usa los parámetros vigentes a la fecha de corte.
- **Parámetros** (HU-21, HU-22):
  - Parámetros legales por año, con edición solo para ADMIN.
  - Valor hora por rol con vigencia e histórico.
  - Consulta de la bonificación por hijos.
- **Autenticación**:
  - Invitación por correo y activación de cuenta (HU-01).
  - Login con correo y contraseña, con bloqueo tras 5 intentos (HU-02).
  - Login con Google, solo para correos invitados (HU-03).
  - Refresh token rotativo en cookie httpOnly, con detección de reutilización, y logout (HU-05).
- **Usuarios** (HU-06): listado, cambio de rol, desactivación con revocación de sesiones y protección del último administrador.
- **Colaboradores**:
  - Importación CSV con vista previa, errores por fila y descarga del reporte de errores (HU-07, HU-08).
  - Creación, edición, desactivación y reactivación con auditoría (HU-09).
  - Búsqueda, filtros y paginación (HU-10).
- Auditoría de las acciones relevantes.
- Migración inicial de la base de datos (`20261013024102_init`) y datos base reutilizables (`sembrarDatosBase`).
- **Pruebas:** 62 unitarias y 40 e2e contra PostgreSQL. El CI levanta PostgreSQL como servicio.

### Corregido
- La API no arrancaba si `GOOGLE_CLIENT_ID` u otra variable opcional estaba vacía en `.env`.

### Pendiente (Sprint 2)
HU-04, HU-11, HU-16 (guardar en la liquidación), HU-17 a HU-20, HU-23, HU-25, HU-26.

## [0.0.1] — Sprint 0 · 2026-10-08

### Agregado
- Toma de requerimientos completa, diseño, ADRs, proceso de trabajo y esqueleto de backend y frontend.
