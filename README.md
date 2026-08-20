# Panel Eonesia

Panel de gestión interno de Eonesia: centraliza producto, ventas, métricas,
aprendizaje, finanzas y onboarding para los 4 socios y el equipo. Ver
`docs/spec.md` para la especificación funcional completa.

**Estado actual:** MVP de la pestaña **Vista global** (6 sectores + páginas de
tag navegables + notificaciones agregadas). El resto de pestañas
(Producción, Métricas, Learning, Finanzas, Onboarding) están en el menú de
navegación con una pantalla de "próximamente" — su contenido se construye en
la siguiente fase.

## Stack

| Capa | Elección |
|---|---|
| Frontend | React + Vite + TypeScript + Tailwind CSS v4 + React Router |
| Backend | Node.js + Express (TypeScript) |
| Base de datos / Auth | Supabase (Postgres + Auth email/contraseña) |
| Iconografía | `@tabler/icons-react` (SVG, sin dependencias externas en runtime) |
| Hosting previsto | Hostinger |

## Estructura del repo

```
apps/
  web/    → frontend (Vite + React)
  api/    → backend (Express)
supabase/
  schema.sql  → esquema SQL (perfiles, permisos, notificaciones, Finanzas)
  README.md   → cómo aplicarlo
docs/
  spec.md → especificación funcional original
```

## Desarrollo local

Requiere Node 20+.

```bash
npm install          # instala todo el monorepo (workspaces)
npm run dev:web       # http://localhost:5173
npm run dev:api       # http://localhost:4000 (opcional en esta fase, ver abajo)
```

### Variables de entorno

Copia los `.env.example` y rellena con tus credenciales:

- `apps/web/.env.example` → `apps/web/.env.local`
- `apps/api/.env.example` → `apps/api/.env`

**Sin Supabase configurado, el frontend arranca en modo demo**: la pantalla
de login muestra un selector de los 4 socios (datos de `apps/web/src/data/socios.ts`)
para entrar sin backend real — pensado para desarrollar y enseñar el panel
antes de tener credenciales. En cuanto `VITE_SUPABASE_URL` y
`VITE_SUPABASE_ANON_KEY` están definidas, el login pasa automáticamente a
email + contraseña real contra Supabase y el selector de perfiles desaparece
(no existe impersonación de otros socios fuera del modo demo — sería un
agujero de seguridad).

## Qué es real y qué es mock ahora mismo

- **UI, navegación de 3 niveles (pestaña → sector → tag) y notificaciones**:
  reales y funcionales, con datos de ejemplo (`apps/web/src/data/globalView.ts`).
- **Auth**: integración real con Supabase Auth (email/contraseña) lista en el
  código; falta que apuntes el proyecto Supabase real vía variables de entorno
  y que actives el proveedor de email en el dashboard (ver `supabase/README.md`).
- **Backend Express**: levantado con `/api/health`, `/api/notifications/summary`
  (mock) y `/api/auth/session` (valida un token de Supabase si está configurado).
  El frontend **todavía no llama a este backend** — sigue usando su mock local
  porque los datos de esta fase son de ejemplo por diseño (spec §7). Cuando se
  conecten fuentes reales (Mail, Banco, Facturación…), esas vistas pasarán a
  consumir el backend en vez del mock.
- **Mail, RRSS, Banco, Biblioteca, Facturación, LXP**: sin conectar todavía
  (requieren credenciales/decisiones que están en "Preguntas abiertas" del
  spec, sección 9). Las tarjetas de esas fuentes en el panel están preparadas
  para mostrar el estado "no conectado" hasta que se integren.

## Seguridad (spec §2)

- [x] Toda ruta del panel exige sesión (`RequireAuth`); no hay contenido
      público servido tras el shell de la app.
- [x] `robots.txt` con `Disallow: /` + meta `robots: noindex, nofollow`.
- [x] `.env*` fuera del repo (`.gitignore`), solo se versionan los `.env.example`.
- [x] RLS diseñada en `supabase/schema.sql` para todas las tablas, con
      Finanzas restringida a socios + permisos explícitos.
- [ ] HTTPS en Hostinger — depende de la configuración del hosting final.
- [ ] 2FA — Supabase lo soporta (TOTP); pendiente de activarlo en el proyecto
      real y añadir el flujo en el login cuando se decida.

## Despliegue (pendiente, notas para cuando haya credenciales)

- **Frontend**: `npm run build:web` genera `apps/web/dist` — servible como
  sitio estático en Hostinger.
- **Backend**: `npm run build:api` compila a `apps/api/dist`; necesita un
  proceso Node persistente (no es un sitio estático) — confirmar qué plan de
  Hostinger lo soporta, o considerar desplegarlo aparte si el hosting
  contratado es solo estático.
- **Repositorio**: el spec pide moverlo al org de GitHub "Desarrollo Eonesia"
  — pendiente de acceso para hacer el transfer.

## Preguntas abiertas (spec §9)

Sin resolver todavía, documentadas para no perderlas de vista:

- Credenciales de API de cada red social (RRSS).
- Mecanismo exacto de conexión Learning/LXP con AWS (¿leer su Supabase
  directamente o replicar datos aquí?).
- Diseño final de las combinaciones de permisos para Empleado/Becario más
  allá del esquema granular ya modelado en `tab_permissions`.
- Proveedor/librería final para el cliente de correo embebido (Gmail API +
  OAuth de Google es la vía más directa, ya prevista en el spec).

## Diseño

Paleta y tipografía son un placeholder propio (base clara, acentos
azul/violeta futuristas) definido en `apps/web/src/index.css` vía tokens
`@theme` de Tailwind — fácil de sustituir cuando haya identidad de marca
definitiva de Eonesia (logo, colores exactos).
