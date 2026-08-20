# Panel Eonesia

Panel de gestión interno de Eonesia: centraliza producto, ventas, métricas,
aprendizaje, finanzas y onboarding para los 4 socios y el equipo. Ver
`docs/spec.md` para la especificación funcional completa.

**Estado actual:** las 6 pestañas del MVP están construidas y navegables —
Vista global, Producción, Métricas, Learning, Finanzas y Onboarding, cada una
con sus sectores, páginas de tag, notificaciones agregadas y sistema de
permisos granular por rol. Se suman una búsqueda global (⌘K), un centro de
notificaciones, favoritos, un libro editable en Facturación ("Holded propio"),
77 tests automatizados (62 web + 15 api) y CI en GitHub Actions. Todos los datos son de ejemplo
(empresa ficticia "Eonesia", activa desde junio de 2022 — ver
`apps/web/src/data/company.ts`).

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
  schema.sql  → esquema SQL (perfiles, permisos, notificaciones, Finanzas,
                facturas, RRSS, embeds, favoritos)
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

### Calidad

```bash
npm run test --workspace apps/web    # Vitest — 60 tests (notificaciones + marcar todas, permisos + excepciones por persona, búsqueda, auth, ErrorBoundary, embeds, entrada manual, ledger + totales, campana de notificaciones, integración TagDetailView)
npm run test --workspace apps/api    # Vitest + supertest — 15 tests (rutas, integraciones + escape XSS, CORS, 404, cabeceras de seguridad)
npm run lint --workspace apps/web    # oxlint
npm run build                        # build de producción de web + api
```

Los tres corren en CI (`.github/workflows/ci.yml`) en cada push y PR.

### Variables de entorno

Copia los `.env.example` y rellena con tus credenciales:

- `apps/web/.env.example` → `apps/web/.env.local`
- `apps/api/.env.example` → `apps/api/.env`

**Sin Supabase configurado, el frontend arranca en modo demo**: la pantalla
de login muestra un selector de los 6 perfiles de ejemplo (4 socios + 1
empleada + 1 becario, en `apps/web/src/data/socios.ts`) para entrar sin
backend real — pensado para desarrollar y enseñar el panel antes de tener
credenciales, y para poder probar el sistema de permisos con cada rol. En
cuanto `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están definidas, el
login pasa automáticamente a email + contraseña real contra Supabase y el
selector de perfiles desaparece (no existe impersonación de otros usuarios
fuera del modo demo — sería un agujero de seguridad).

**Importante para producción**: las variables `VITE_*` las incrusta Vite en
el JS **al hacer `npm run build`**, no las lee en caliente el servidor donde
se aloje — a diferencia de las variables de `apps/api`, que sí se leen en
tiempo de ejecución porque Express es un proceso Node de verdad. Si defines
`VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` en el panel de Hostinger
*después* de haber generado `apps/web/dist`, no tendrán ningún efecto: hay
que tenerlas puestas en `apps/web/.env.local` (o como variables de entorno
del propio proceso de build) **antes** de ejecutar el build, y volver a
generar y subir `dist/` cada vez que cambien.

## Sistema de permisos

Los 4 socios tienen acceso completo siempre. Empleados y becarios ven solo lo
que un socio les active desde **Permisos** (enlace en el sidebar, visible
solo para socios → `/panel/admin/permisos`), con dos niveles tal como pide el
spec §3 ("qué ve cada rol/usuario"):

1. **Por rol**: valores por defecto para todos los Empleados o todos los
   Becarios, con granularidad por pestaña y por sector dentro de cada pestaña.
2. **Por persona** ("Excepciones por persona" en la misma pantalla): da o
   quita el acceso a una pestaña concreta para alguien en particular sin
   tocar el valor por defecto de su rol — p. ej. que Marta vea Finanzas sin
   dar Finanzas a todo Desarrollo. Un botón "Rol" quita la excepción y esa
   persona vuelve a seguir el valor de su rol.

La aplicación se refuerza en tres capas: el sidebar oculta lo no permitido,
la vista de pestaña filtra las tarjetas de sector, y la página de contenido
bloquea el acceso directo por URL con un estado "Acceso restringido". En
esta fase los permisos se guardan en `localStorage`; el esquema
`tab_permissions` en `supabase/schema.sql` ya modela ambos niveles
(`subject_type: 'role' | 'user'`) para cuando se persista en servidor.

## Qué es real y qué es mock ahora mismo

- **UI, navegación de 3 niveles (pestaña → sector → tag), notificaciones y
  permisos por rol**: reales y funcionales, con datos de ejemplo
  (`apps/web/src/data/*.ts`, uno por pestaña).
- **Búsqueda global (⌘K), centro de notificaciones y favoritos**: reales,
  respetan los permisos del rol activo, persistidos en `localStorage`.
- **Auth**: integración real con Supabase Auth (email/contraseña + recuperar
  contraseña) lista en el código; falta que apuntes el proyecto Supabase real
  vía variables de entorno y que actives el proveedor de email en el
  dashboard (ver `supabase/README.md`).
- **Facturación** (Finanzas > Facturación > Facturas): libro editable de
  verdad — añade y elimina facturas desde el panel ("Holded propio", spec §8),
  con un total en el pie de la tabla que se recalcula al vuelo (parseo de
  importes en formato español vía `apps/web/src/lib/currency.ts`), guardado
  en `localStorage` hasta que se conecte la tabla `invoices`.
- **Backend Express**: `/api/health`, `/api/notifications/summary` (mock),
  `/api/auth/session` (valida un token de Supabase si está configurado) y
  `/api/integrations/*` (ver siguiente sección). El frontend **todavía no
  llama a este backend para el contenido del panel** — sigue usando su mock
  local porque los datos de esta fase son de ejemplo por diseño (spec §7).
- **Biblioteca** (Drive/FTPs/Trello/Miro): los slots de embed funcionan de
  verdad — pega la URL pública y queda embebida en un iframe dentro del
  panel, guardada en `localStorage` hasta que haya backend. Solo se aceptan
  URLs `http(s)` (se rechazan `javascript:`/`data:`/etc.) y el iframe lleva
  `sandbox` sin `allow-top-navigation`, para que la página embebida no pueda
  ejecutar código fuera de su marco ni redirigir todo el panel — ver
  `apps/web/src/components/panel/EmbedSlot.tsx`.
- **RRSS** (Web/LinkedIn/Instagram/Facebook/TikTok): el formulario de entrada
  manual funciona de verdad (spec §8 — "construir la vista para entrada
  manual"), con validación de campos obligatorios y borrado de registros,
  guardando cada uno en `localStorage`.
- **Mail, Banco (open banking), LXP**: sin conectar todavía — cada tag
  muestra una tarjeta de estado ("pendiente"/"no conectado") con qué falta
  exactamente para activarlo.

## Conexiones de API — listas para activar

Todo lo que sigue está **preparado en código** pero requiere credenciales
reales que no existen en este entorno. Variables documentadas en
`apps/api/.env.example`.

| Integración | Endpoint / mecanismo | Qué falta |
|---|---|---|
| Gmail (Mail) | `GET /api/integrations/gmail/oauth/start?account=info` inicia el flujo OAuth real; `GET /api/integrations/gmail/oauth/callback` lo recibe | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` de Google Cloud Console + implementar el intercambio de `code` por tokens (TODO marcado en `apps/api/src/routes/integrations.ts`) y su persistencia en Supabase |
| RRSS (LinkedIn/Meta/TikTok) | — | Apps aprobadas por cada plataforma (`LINKEDIN_CLIENT_ID`, `META_APP_ID`, `TIKTOK_CLIENT_KEY`…) — mientras tanto, entrada manual funcional |
| Web (Analytics) | — | Cuenta de GA4 + `GA4_PROPERTY_ID` / service account |
| Banco | — | Proveedor de Open Banking PSD2 (GoCardless Bank Account Data, Tink…) — `OPEN_BANKING_PROVIDER` / `OPEN_BANKING_API_KEY` |
| Learning/LXP | — | Decidir modo directo vs. réplica (spec §9) + `LXP_DATABASE_URL` |
| `GET /api/integrations/status` | ya funciona | Devuelve `{configured: boolean}` por integración, leyendo las variables de entorno anteriores — útil para que el frontend sustituya las tarjetas "no conectado" en cuanto haya credenciales |

## Seguridad (spec §2)

- [x] Toda ruta del panel exige sesión (`RequireAuth`); no hay contenido
      público servido tras el shell de la app.
- [x] `robots.txt` con `Disallow: /` + meta `robots: noindex, nofollow`.
- [x] `.env*` fuera del repo (`.gitignore`), solo se versionan los `.env.example`.
- [x] RLS diseñada en `supabase/schema.sql` para todas las tablas, con
      Finanzas restringida a socios + permisos explícitos.
- [x] Permisos granulares por pestaña/sector para Empleado/Becario, con
      bloqueo de acceso directo por URL además de ocultar la navegación.
- [x] Embeds (Biblioteca) solo aceptan URLs `http(s)` y el iframe lleva
      `sandbox` sin `allow-top-navigation`.
- [x] El callback OAuth de Gmail (`apps/api`) escapa los parámetros de la
      query antes de interpolarlos en HTML — sin esto era un XSS reflejado
      alcanzable con una URL directa, sin necesidad de pasar por Google.
- [x] `apps/api` usa `helmet` para cabeceras de seguridad por defecto
      (`X-Content-Type-Options`, oculta `X-Powered-By`, etc.).
- [x] Errores de validación (login, entrada manual, embeds) llevan
      `role="alert"` y `aria-describedby` — se anuncian a lectores de
      pantalla, no solo se ven en rojo.
- [x] El buscador global (⌘K) sigue el patrón ARIA de combobox
      (`role="combobox"`/`listbox`/`option`, `aria-activedescendant`) — antes
      el resultado activo solo se distinguía visualmente.
- [x] El botón de la campana incluye el nº de no leídas en su
      `aria-label` — un `aria-label` estático ocultaba el contador visual a
      lectores de pantalla (el `aria-label` sustituye a todo el contenido
      descendiente al calcular el nombre accesible).
- [ ] HTTPS en Hostinger — depende de la configuración del hosting final.
- [ ] 2FA — Supabase lo soporta (TOTP); pendiente de activarlo en el proyecto
      real y añadir el flujo en el login cuando se decida.

## Despliegue (pendiente, notas para cuando haya credenciales)

- **Frontend**: `npm run build:web` genera `apps/web/dist` — servible como
  sitio estático en Hostinger. Incluye `.htaccess` con reescritura para
  Apache: sin él, refrescar la página o abrir un enlace directo a cualquier
  ruta anidada (p.ej. `/panel/finanzas/facturacion/facturas`) da 404, porque
  esa ruta solo existe en el navegador vía React Router, no como archivo real
  en el servidor. Verificado que sin reglas de fallback un servidor estático
  devuelve 404 en rutas anidadas; el patrón de `.htaccess` es el estándar
  para Apache pero no he podido probarlo contra un Apache real en este
  entorno — confírmalo con un refresh en `/panel/algo/algo` nada más
  desplegar.
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
- Combinaciones concretas de permisos que querréis usar en el día a día —
  el sistema ya es granular por pestaña/sector, pero los valores por defecto
  en `apps/web/src/lib/permissions.tsx` (`seedPermissions`) son una propuesta
  de partida, no una decisión final.
- Proveedor/librería final para el cliente de correo embebido (Gmail API +
  OAuth de Google es la vía más directa, ya prevista y con el flujo OAuth
  scaffolded en `apps/api/src/routes/integrations.ts`).

## Diseño

Paleta y tipografía son un placeholder propio (base clara, acentos
azul/violeta futuristas) definido en `apps/web/src/index.css` vía tokens
`@theme` de Tailwind — fácil de sustituir cuando haya identidad de marca
definitiva de Eonesia (logo, colores exactos).
