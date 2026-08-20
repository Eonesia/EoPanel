# Panel de gestión interno — Eonesia

Documento de especificación para construir con Claude Code. Este panel **no** pertenece a "Grupo Musso" — es un producto interno nuevo de Eonesia, con identidad visual propia.

---

## 1. Resumen

Panel de gestión interna para los 4 socios de Eonesia (y roles adicionales de empleado/becario), que centraliza producto, ventas, métricas, aprendizaje, finanzas y onboarding en una única herramienta, sustituyendo hojas sueltas, excels y accesos dispersos.

---

## 2. Stack técnico

| Capa | Elección |
|---|---|
| Frontend | A definir junto con el sistema de diseño (ver sección 6) |
| Backend | Node.js + Express, siguiendo el patrón ya usado en Eonesia SaaS |
| Base de datos | Supabase |
| Hosting | Hostinger |
| Repositorio | Nuevo repo dentro del GitHub org **Desarrollo Eonesia** |
| Auth | Email + contraseña |

### Seguridad — requisito crítico
Toda la información del panel es interna y sensible (finanzas, contratos, datos de clientes). Nada puede quedar público:
- Panel completo detrás de login, sin rutas públicas.
- `robots.txt` con `noindex` / sin indexación en buscadores.
- Variables de entorno y credenciales fuera del repo (`.env`, nunca committeadas).
- HTTPS obligatorio en Hostinger.
- Revisar políticas de RLS en Supabase (row-level security) para cada tabla, especialmente Finanzas.
- Considerar 2FA en el login dado el nivel de sensibilidad de los datos.

---

## 3. Roles y permisos

Roles: **Socio**, **Empleado**, **Becario**.

- Los 4 socios tienen acceso completo a todo el panel.
- Empleado y Becario: acceso configurable por sección/pestaña desde un panel de administración de permisos (los socios deciden qué ve cada rol/usuario).
- El sistema de permisos debe ser granular a nivel de pestaña y, si es posible, a nivel de sector dentro de cada pestaña.

---

## 4. Navegación

Estructura de 3 niveles:

1. **Pestaña** (ej. Vista global, Producción, Métricas, Learning, Finanzas, Onboarding) — el menú de pestañas debe estar siempre visible.
2. **Sector** dentro de la pestaña (ej. dentro de Vista global: Hoy, Producto, Ventas, Finanzas, Infraestructura, Mail) — vista propia con información y/o botones a sus tags.
3. **Tag** — acceso directo a la página de detalle de ese tag, **dentro del mismo panel** (sin abrir pestaña nueva del navegador), con botón "volver" que regresa a la vista del sector/pestaña anterior.

---

## 5. Sistema de notificaciones

Contador numérico acumulativo en tres niveles, agregando de abajo hacia arriba:

- **Tag / página**: número de notificaciones propias de ese tag.
- **Sector**: suma de las notificaciones de todos sus tags/páginas asociadas.
- **Pestaña**: suma de las notificaciones de todos sus sectores.

El badge debe mostrarse en pestañas, sectores y tags simultáneamente, siempre reflejando la suma correspondiente en tiempo real.

---

## 6. Diseño y sistema visual

**Dirección de marca**: nada de Grupo Musso. Estética propia de Eonesia: software de gestión futurista, base blanca/clara, con matices de la identidad visual de Eonesia. Elegante, con toques 3D y degradados sutiles, botones y animaciones a la altura — que no parezca una plantilla genérica.

**Uso previsto**: escritorio y móvil desde el inicio (responsive real, no solo adaptado).

Para elevar el nivel de diseño en Claude Code, aplicar estas tres capas (no son opcionales, son parte del brief):

1. **Micro-interacciones tipo Emil Kowalski** — animaciones de interfaz reales: transiciones de botones, estados hover/active, microanimaciones que den sensación premium, no solo CSS por defecto.
2. **Pase de "Impeccable Design"** — tras montar cada vista, ejecutar una limpieza de espaciado, tipografía y jerarquía visual antes de darla por terminada.
3. **Taste Skill / referencias reales de diseño** — antes de generar cada interfaz, dar a Claude Code referencias visuales reales (productos de gestión modernos: Linear, Notion, Vercel dashboard, etc.) en vez de dejar que caiga en patrones genéricos por defecto.

---

## 7. Alcance del MVP

- Empezamos por la pestaña **Vista global**, completa: sus 6 sectores con vista propia + páginas de tags navegables + sistema de notificaciones funcionando ahí.
- El resto de pestañas (Producción, Métricas, Learning, Finanzas, Onboarding) deben existir en el menú de navegación desde el principio, aunque su contenido interno se construya después.
- Los datos son **de ejemplo/mock** en esta fase — se irán sustituyendo por datos reales a medida que se conecten las fuentes.

---

## 8. Fuentes de datos por sección

| Sección | Tipo de dato | Detalle |
|---|---|---|
| **Mail** | Conectado (real) | Gestor de correo funcional de verdad, integrado vía API con las 3 cuentas comunes (info, desarrollo, Gmail) + cuentas personales por socio. Requiere OAuth de Google. |
| **RRSS** (Web, Linkedin, Instagram, Facebook, Tiktok) | Manual por ahora | Aún no hay credenciales de API de cada plataforma. Construir la vista para entrada manual, dejando la estructura preparada para conectar APIs más adelante. |
| **Banco / Finanzas** | Manual → previsión | Se irá actualizando la previsión de ingresos/gastos manualmente, y de ahí se calculará el estado actual. Añadir además seguimiento de deuda bancaria: cuotas, fecha de fin de pago, intereses, capital amortizado. |
| **Biblioteca** (Drive, FTPs, Trello, Miro) | Embebido | Contenido embebido dentro del panel (iframe u equivalente), no solo enlaces externos. |
| **Facturación / Contabilidad** | Migración + manual | Volcar el histórico de excels de contabilidad de los últimos años como base, y a partir de ahí llevar el día a día desde el panel: un "Holded propio" con historial de gastos por categorías. |
| **Learning / LXP** | Por definir | La LXP ya está conectada a AWS (plataforma Eonesia SaaS / Supabase). Definir en fase de construcción si se consume directamente esa base de datos o se replica. |

---

## 9. Preguntas abiertas para resolver durante el desarrollo

- Credenciales de API de cada red social (RRSS) — pendientes.
- Mecanismo exacto de conexión Learning/LXP con la infraestructura AWS existente.
- Diseño final del sistema de permisos granular para Empleado/Becario (qué combinaciones concretas de acceso existirán).
- Proveedor/librería para el cliente de correo embebido (Gmail API vía OAuth es el camino más directo).

---

## 10. Resumen de pestañas y sectores (referencia funcional)

**Vista global**: Hoy · Producto · Ventas · Finanzas · Infraestructura · Mail

**Producción**: ToDo · Factoría · Propuestas · Proyectos · Biblioteca

**Métricas**: RRSS · B2C · B2B · LXP

**Learning**: LXP · Usuarios

**Finanzas**: Contabilidad · Recordatorios · Previsión · Banco · Facturación · CRM clientes · Legal

**Onboarding**: Proyectos y roles · Responsabilidades · Historial · Becarios

*(El listado detallado de tags por sector está en el mockup HTML adjunto — úsalo como referencia de contenido, no de estética final.)*
