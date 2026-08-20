import type { Sector, Tag } from "./types";

function tag(t: Tag): Tag {
  return t;
}

const todo: Sector = {
  id: "todo",
  label: "ToDo",
  icon: "ti-checklist",
  description: "Tareas del equipo por prioridad.",
  widgetStats: [
    { label: "Tareas abiertas", value: "23" },
    { label: "Urgentes", value: "4", trendDirection: "flat" },
    { label: "Completadas (7 días)", value: "18", trend: "+18", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "urgente",
      label: "Urgente",
      icon: "ti-flag",
      notifications: 4,
      summary: "Tareas críticas con fecha límite inminente.",
      detail: {
        intro: "Tareas marcadas como urgentes por cualquier socio, ordenadas por vencimiento.",
        list: [
          { title: "Cerrar propuesta VR — Colegio Alameda", meta: "Álvaro Linares · vence hoy", status: "danger" },
          { title: "Resolver bug de reproducción 360° en iOS", meta: "Rafa Dorado · vence mañana", status: "danger" },
          { title: "Enviar factura pendiente IES Sierra Nevada", meta: "Carlos Gallego · vence hoy", status: "warn" },
          { title: "Preparar demo feria EDUTECH", meta: "Sergio Vegas · vence en 2 días", status: "warn" },
        ],
      },
    }),
    tag({
      id: "importante",
      label: "Importante",
      icon: "ti-star",
      notifications: 2,
      summary: "Sin fecha inmediata pero de alto impacto.",
      detail: {
        intro: "Trabajo de fondo que mueve el negocio aunque no tenga deadline esta semana.",
        list: [
          { title: "Rediseñar onboarding de nuevos centros", meta: "Sergio Vegas", status: "neutral" },
          { title: "Documentar API interna de Mundos360", meta: "Rafa Dorado", status: "neutral" },
        ],
      },
    }),
    tag({
      id: "haciendo",
      label: "Haciendo",
      icon: "ti-player-play",
      notifications: 0,
      summary: "En curso ahora mismo por el equipo.",
      detail: {
        intro: "Lo que cada socio o empleado tiene entre manos en este momento.",
        list: [
          { title: "Grabación 360° laboratorio de física", meta: "Rafa Dorado", status: "ok" },
          { title: "Guion experiencia VR salud", meta: "Álvaro Linares", status: "ok" },
          { title: "Migración contabilidad 2024 al panel", meta: "Carlos Gallego", status: "ok" },
        ],
      },
    }),
    tag({
      id: "por-hacer",
      label: "Por hacer",
      icon: "ti-inbox",
      notifications: 0,
      summary: "Backlog priorizado sin empezar.",
      detail: {
        intro: "Backlog general, priorizado de arriba a abajo.",
        list: [
          { title: "Explorar integración con Kahoot", meta: "Backlog", status: "neutral" },
          { title: "Plantilla de propuesta comercial v2", meta: "Backlog", status: "neutral" },
          { title: "Auditoría de accesibilidad LXP", meta: "Backlog", status: "neutral" },
        ],
      },
    }),
    tag({
      id: "molar",
      label: "Molar",
      icon: "ti-bulb",
      notifications: 1,
      summary: "Ideas experimentales sin compromiso de fecha.",
      detail: {
        intro: "El cajón de ideas que \"molarían\" — sin presión, para cuando haya hueco.",
        list: [{ title: "Experiencia 360° submarina con IA generativa", meta: "Idea de Rafa", status: "neutral" }],
      },
    }),
  ],
};

const factoria: Sector = {
  id: "factoria",
  label: "Factoría",
  icon: "ti-flask",
  description: "De la idea al producto final.",
  widgetStats: [
    { label: "En pipeline", value: "11" },
    { label: "MVPs activos", value: "3" },
  ],
  tags: [
    tag({
      id: "ideas",
      label: "Ideas",
      icon: "ti-bulb",
      notifications: 2,
      summary: "Conceptos sin validar todavía.",
      detail: {
        intro: "Ideas propuestas por el equipo, pendientes de validar viabilidad.",
        list: [
          { title: "Gemelo digital de aula para simulacros", status: "neutral" },
          { title: "Modo colaborativo multi-usuario en VR", status: "neutral" },
        ],
      },
    }),
    tag({
      id: "mvps",
      label: "MVPs",
      icon: "ti-rocket",
      notifications: 1,
      summary: "Prototipos mínimos en validación con clientes.",
      detail: {
        intro: "MVPs actualmente en prueba con centros piloto.",
        list: [{ title: "Editor de escenarios 360° self-service", meta: "Piloto con 2 centros", status: "ok" }],
      },
    }),
    tag({
      id: "producto-final",
      label: "Producto final",
      icon: "ti-package",
      notifications: 0,
      summary: "Lo que ya está listo para vender.",
      detail: {
        intro: "Salidas de factoría ya productivas y vendibles.",
        list: [
          { title: "Mundos360 — catálogo estándar", status: "ok" },
          { title: "Pack VR salud y ciencias", status: "ok" },
        ],
      },
    }),
    tag({
      id: "avatares",
      label: "Avatares",
      icon: "ti-user-square-rounded",
      notifications: 0,
      summary: "Biblioteca de avatares para experiencias.",
      detail: { intro: "Avatares 3D reutilizables entre experiencias.", stats: [{ label: "Avatares en catálogo", value: "18" }] },
    }),
    tag({
      id: "escenarios",
      label: "Escenarios",
      icon: "ti-photo",
      notifications: 0,
      summary: "Entornos 360°/3D reutilizables.",
      detail: { intro: "Escenarios base reutilizables entre proyectos.", stats: [{ label: "Escenarios en catálogo", value: "24" }] },
    }),
    tag({
      id: "ui",
      label: "UI",
      icon: "ti-layout",
      notifications: 0,
      summary: "Sistema de interfaz de los productos.",
      detail: { intro: "Componentes de interfaz compartidos entre Mundos360, LXP y VR." },
    }),
    tag({
      id: "ux",
      label: "UX",
      icon: "ti-route",
      notifications: 1,
      summary: "Investigación y flujos de experiencia de usuario.",
      detail: {
        intro: "Estudios de usuario y flujos en curso.",
        list: [{ title: "Test de usabilidad con profesorado — panel de progreso", status: "warn" }],
      },
    }),
  ],
};

const propuestas: Sector = {
  id: "propuestas",
  label: "Propuestas",
  icon: "ti-file-description",
  description: "Salidas de factoría formateadas para cliente.",
  widgetStats: [
    { label: "En curso", value: "6" },
    { label: "Tasa de aceptación", value: "58%", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "por-maquetar",
      label: "Por maquetar",
      icon: "ti-pencil",
      notifications: 2,
      summary: "Contenido listo, falta maquetación final.",
      detail: {
        intro: "Propuestas con contenido cerrado pendientes de maquetar.",
        list: [
          { title: "Propuesta VR salud — Feria EDUTECH", status: "warn" },
          { title: "Propuesta LXP anual — IES Sierra Nevada", status: "warn" },
        ],
      },
    }),
    tag({
      id: "hechas",
      label: "Hechas",
      icon: "ti-check",
      notifications: 0,
      summary: "Maquetadas y enviadas al cliente.",
      detail: { intro: "Propuestas ya enviadas, esperando respuesta o en negociación.", stats: [{ label: "Enviadas este mes", value: "5" }] },
    }),
    tag({
      id: "a-la-espera",
      label: "A la espera",
      icon: "ti-clock",
      notifications: 1,
      summary: "Enviadas, pendientes de respuesta del cliente.",
      detail: {
        intro: "Propuestas enviadas sin respuesta todavía.",
        list: [{ title: "Fundación Aprende+ — Mundos360 pack básico", meta: "12 días sin respuesta", status: "warn" }],
      },
    }),
    tag({
      id: "finales",
      label: "Finales",
      icon: "ti-trophy",
      notifications: 0,
      summary: "Aceptadas y convertidas en proyecto.",
      detail: { intro: "Propuestas ganadas, ya convertidas en proyecto activo.", stats: [{ label: "Ganadas (año)", value: "14" }] },
    }),
  ],
};

const proyectos: Sector = {
  id: "proyectos",
  label: "Proyectos",
  icon: "ti-briefcase",
  description: "CRM de proyectos y visuales del equipo.",
  widgetStats: [
    { label: "Proyectos activos", value: "9" },
    { label: "Entregas este mes", value: "3" },
  ],
  tags: [
    tag({
      id: "crm-proyectos",
      label: "CRM",
      icon: "ti-list-details",
      notifications: 2,
      summary: "Seguimiento de todos los proyectos activos.",
      detail: {
        intro: "Vista de gestión de proyectos activos, con responsable y estado.",
        table: {
          columns: ["Proyecto", "Cliente", "Responsable", "Estado", "Entrega"],
          rows: [
            { Proyecto: "Mundos360 Colegio Alameda", Cliente: "Colegio Alameda", Responsable: "Rafa Dorado", Estado: "En curso", Entrega: "28 ago" },
            { Proyecto: "VR Feria Salud", Cliente: "Feria EDUTECH", Responsable: "Álvaro Linares", Estado: "Revisión", Entrega: "02 sep" },
            { Proyecto: "LXP evaluaciones", Cliente: "Interno", Responsable: "Sergio Vegas", Estado: "Bloqueado", Entrega: "s/f" },
          ],
        },
      },
    }),
    tag({
      id: "visuales",
      label: "Visuales",
      icon: "ti-photo-video",
      notifications: 0,
      summary: "Material visual de cada proyecto.",
      detail: {
        intro: "Recursos visuales (renders, capturas, vídeos) organizados por proyecto.",
        embed: {
          label: "Carpeta de visuales",
          description: "Conecta la carpeta compartida (Drive/Frame.io) donde se organiza el material visual por proyecto.",
        },
      },
    }),
  ],
};

const biblioteca: Sector = {
  id: "biblioteca",
  label: "Biblioteca",
  icon: "ti-folders",
  description: "Accesos directos embebidos dentro del panel.",
  tags: [
    tag({
      id: "drive",
      label: "Drive",
      icon: "ti-brand-google-drive",
      notifications: 0,
      summary: "Documentos y archivos compartidos del equipo.",
      detail: {
        intro: "Carpeta compartida de Google Drive embebida directamente en el panel.",
        embed: { label: "Google Drive", description: "Pega el enlace de vista pública/compartida de la carpeta raíz de Drive." },
      },
    }),
    tag({
      id: "ftps",
      label: "FTPs",
      icon: "ti-server-2",
      notifications: 0,
      summary: "Accesos a servidores de proyectos.",
      detail: {
        intro: "Listado de accesos FTP de proyectos con hosting propio.",
        list: [
          { title: "ftp.mundos360.eonesia.com", meta: "Producción", status: "ok" },
          { title: "ftp.staging.eonesia.com", meta: "Staging", status: "neutral" },
        ],
      },
    }),
    tag({
      id: "trello",
      label: "Trello",
      icon: "ti-brand-trello",
      notifications: 3,
      summary: "Tableros de seguimiento de equipo.",
      detail: {
        intro: "Tablero de Trello embebido para seguimiento visual rápido.",
        embed: { label: "Trello", description: "Pega el enlace de vista pública del tablero de Trello del equipo." },
      },
    }),
    tag({
      id: "miro",
      label: "Miro",
      icon: "ti-chalkboard",
      notifications: 0,
      summary: "Pizarras de diseño y producto.",
      detail: {
        intro: "Pizarra de Miro embebida para sesiones de diseño y producto.",
        embed: { label: "Miro", description: "Pega el enlace de vista pública del board de Miro." },
      },
    }),
  ],
};

export const produccionSectors: Sector[] = [todo, factoria, propuestas, proyectos, biblioteca];
