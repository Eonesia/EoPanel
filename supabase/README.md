# Supabase — Panel Eonesia

## Aplicar el esquema

1. Crea un proyecto en [supabase.com](https://supabase.com) (o usa el que ya tengas).
2. En el SQL Editor del dashboard, pega y ejecuta el contenido de `schema.sql`.
3. Activa el proveedor de **Email** en Authentication → Providers (email + contraseña).
4. En Authentication → Settings, considera activar la confirmación de email y,
   si se quiere reforzar la seguridad indicada en el spec, el 2FA (TOTP) por usuario.

## Variables de entorno

- `apps/web/.env.local` → `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
  (Settings → API → Project URL / anon public key).
- `apps/api/.env` → `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`
  (Settings → API → service_role key — **nunca** la pongas en el frontend).

## Estado del esquema

Este es un borrador cubriendo lo necesario para el MVP (perfiles, permisos
granulares por pestaña/sector, notificaciones y Finanzas). Tablas para el resto
de secciones (RRSS manual, Biblioteca embebida, Facturación/Contabilidad,
espejo o conexión con LXP) se añadirán cuando se construya cada pestaña —
de momento el frontend funciona con datos de ejemplo y no depende de Supabase
para su contenido.

## RLS

Todas las tablas tienen row-level security activada. Los 4 socios tienen
acceso completo (verificado vía `profiles.role = 'socio'`); empleados y
becarios solo ven lo que `tab_permissions` les concede explícitamente.
Revisa y amplía las políticas de `forecast_entries` y `bank_debts` antes de
cargar datos reales — son las tablas más sensibles del panel.
