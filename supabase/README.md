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

Cubre perfiles, permisos granulares por pestaña/sector, notificaciones,
Finanzas (previsión + deuda bancaria), y la contrapartida en base de datos de
cada función que hoy vive en `localStorage` en el frontend:

| Tabla | Sustituye a (frontend) |
|---|---|
| `invoices` | `EditableLedger` — Facturación > Facturas ("Holded propio") |
| `social_metrics` | `ManualEntryForm` — Métricas > RRSS |
| `embeds` | `EmbedSlot` — Biblioteca (Drive/FTPs/Trello/Miro) |
| `favorites` | `lib/favorites.tsx` |

Migrar cada una es un intercambio de `useLocalStorage` por llamadas a
`supabase-js` en el componente correspondiente — el resto de la UI no cambia.
LXP se modelará cuando se decida el mecanismo de conexión con AWS (spec §9);
de momento el frontend funciona con datos de ejemplo y no depende de Supabase
para su contenido.

## RLS

Todas las tablas tienen row-level security activada. Los 4 socios tienen
acceso completo (verificado vía `profiles.role = 'socio'`); empleados y
becarios solo ven lo que `tab_permissions` les concede explícitamente.
Revisa y amplía las políticas de `forecast_entries` y `bank_debts` antes de
cargar datos reales — son las tablas más sensibles del panel.
