import type { Sector, Tag } from "./types";

function tag(t: Tag): Tag {
  return t;
}

const hoy: Sector = {
  id: "hoy",
  label: "Hoy",
  icon: "ti-sun",
  description: "Agenda y prioridades del día para los 4 socios.",
  widgetStats: [
    { label: "Caja disponible", value: "38.240 €", trend: "+3,1%", trendDirection: "up" },
    { label: "Tareas urgentes", value: "5", trend: "2 nuevas", trendDirection: "up" },
    { label: "Proyectos activos", value: "9", trendDirection: "flat" },
  ],
  tags: [
    tag({
      id: "caja",
      label: "Caja",
      icon: "ti-cash",
      notifications: 1,
      summary: "Saldo consolidado de las cuentas operativas.",
      detail: {
        intro: "Vista rápida de la liquidez disponible hoy, agregando las cuentas de Banco y los cobros pendientes de confirmar.",
        stats: [
          { label: "Saldo actual", value: "38.240 €", trend: "+1.180 € hoy", trendDirection: "up" },
          { label: "Cobros pendientes", value: "12.500 €" },
          { label: "Pagos programados (7 días)", value: "6.900 €" },
        ],
        note: "Dato de ejemplo — se conectará con Banco y Previsión cuando esas fuentes estén integradas.",
      },
    }),
    tag({
      id: "prioridades",
      label: "Prioridades",
      icon: "ti-flag",
      notifications: 3,
      summary: "Lo importante de hoy, marcado por cada socio.",
      detail: {
        intro: "Prioridades marcadas por los socios para hoy, ordenadas por urgencia.",
        list: [
          { title: "Cerrar propuesta VR — Colegio Alameda", meta: "Álvaro Linares · vence hoy", status: "danger" },
          { title: "Revisar facturación de agosto", meta: "Carlos Gallego", status: "warn" },
          { title: "Onboarding nuevo becario", meta: "Sergio Vegas", status: "neutral" },
          { title: "Actualizar demo Mundos360", meta: "Rafa Dorado", status: "ok" },
        ],
      },
    }),
    tag({
      id: "kpis",
      label: "KPIs",
      icon: "ti-chart-dots",
      notifications: 0,
      summary: "Indicadores clave del negocio de un vistazo.",
      detail: {
        intro: "Indicadores agregados de producto, ventas y finanzas para el mes en curso.",
        stats: [
          { label: "MRR", value: "14.900 €", trend: "+6%", trendDirection: "up" },
          { label: "Leads activos", value: "27", trend: "+4", trendDirection: "up" },
          { label: "Churn mensual", value: "1,8%", trendDirection: "down" },
          { label: "NPS plataforma", value: "62", trendDirection: "flat" },
        ],
      },
    }),
    tag({
      id: "seguimiento-proyectos",
      label: "Seguimiento de proyectos",
      icon: "ti-timeline",
      notifications: 2,
      summary: "Estado de avance de los proyectos en curso.",
      detail: {
        intro: "Resumen del estado de los proyectos activos gestionados desde Producción.",
        table: {
          columns: ["Proyecto", "Responsable", "Estado", "Entrega"],
          rows: [
            { Proyecto: "Mundos360 — Colegio Alameda", Responsable: "Rafa Dorado", Estado: "En curso", Entrega: "28 ago" },
            { Proyecto: "Experiencia VR Feria Salud", Responsable: "Álvaro Linares", Estado: "Revisión", Entrega: "02 sep" },
            { Proyecto: "LXP — módulo evaluaciones", Responsable: "Sergio Vegas", Estado: "Bloqueado", Entrega: "s/f" },
          ],
        },
      },
    }),
  ],
};

const producto: Sector = {
  id: "producto",
  label: "Producto",
  icon: "ti-rocket",
  description: "Estado de los productos activos de Eonesia.",
  widgetStats: [
    { label: "Productos activos", value: "4" },
    { label: "Clientes activos", value: "31", trend: "+2 este mes", trendDirection: "up" },
    { label: "Incidencias abiertas", value: "3", trendDirection: "down" },
  ],
  tags: [
    tag({
      id: "mundos360",
      label: "Mundos360",
      icon: "ti-globe",
      notifications: 2,
      summary: "Producto de experiencias educativas en 360°.",
      detail: {
        intro: "Estado del producto insignia de experiencias inmersivas 360° para centros educativos.",
        stats: [
          { label: "Centros activos", value: "18" },
          { label: "Experiencias publicadas", value: "64" },
          { label: "Uptime plataforma", value: "99,95%", trendDirection: "flat" },
        ],
      },
    }),
    tag({
      id: "experiencias",
      label: "Experiencias",
      icon: "ti-eye",
      notifications: 0,
      summary: "Catálogo de experiencias inmersivas disponibles.",
      detail: {
        intro: "Catálogo de experiencias producidas, por estado de publicación.",
        list: [
          { title: "Laboratorio de química inmersivo", meta: "Publicada", status: "ok" },
          { title: "Recorrido histórico Al-Ándalus", meta: "Publicada", status: "ok" },
          { title: "Sistema solar interactivo", meta: "En producción", status: "warn" },
        ],
      },
    }),
    tag({
      id: "producto-clientes",
      label: "Clientes",
      icon: "ti-building",
      notifications: 1,
      summary: "Centros y organizaciones con producto activo.",
      detail: {
        intro: "Clientes con producto activo y su nivel de uso reciente.",
        table: {
          columns: ["Cliente", "Producto", "Uso último mes", "Estado"],
          rows: [
            { Cliente: "Colegio Alameda", Producto: "Mundos360", "Uso último mes": "Alto", Estado: "Activo" },
            { Cliente: "IES Sierra Nevada", Producto: "LXP", "Uso último mes": "Medio", Estado: "Activo" },
            { Cliente: "Fundación Aprende+", Producto: "VR", "Uso último mes": "Bajo", Estado: "En riesgo" },
          ],
        },
      },
    }),
    tag({
      id: "vr",
      label: "VR",
      icon: "ti-device-vr",
      notifications: 0,
      summary: "Línea de producto de experiencias en realidad virtual.",
      detail: {
        intro: "Estado de los desarrollos y despliegues de realidad virtual.",
        stats: [
          { label: "Gafas desplegadas", value: "42" },
          { label: "Proyectos VR activos", value: "3" },
        ],
      },
    }),
    tag({
      id: "producto-otros",
      label: "Otros",
      icon: "ti-apps",
      notifications: 0,
      summary: "Desarrollos menores y pilotos en curso.",
      detail: {
        intro: "Pilotos y desarrollos que aún no forman parte de una línea de producto consolidada.",
        list: [
          { title: "Piloto realidad aumentada — museo local", meta: "Fase de prueba", status: "neutral" },
        ],
      },
    }),
  ],
};

const ventas: Sector = {
  id: "ventas",
  label: "Ventas",
  icon: "ti-target",
  description: "Pipeline comercial y leads activos.",
  widgetStats: [
    { label: "Pipeline total", value: "86.400 €" },
    { label: "Leads activos", value: "27", trend: "+4", trendDirection: "up" },
    { label: "Tasa de cierre", value: "23%", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "encargos",
      label: "Encargos",
      icon: "ti-clipboard-list",
      notifications: 4,
      summary: "Encargos comerciales en curso y su estado.",
      detail: {
        intro: "Encargos con presupuesto enviado o en negociación.",
        table: {
          columns: ["Encargo", "Cliente", "Importe", "Fase"],
          rows: [
            { Encargo: "Experiencia VR salud", Cliente: "Colegio Alameda", Importe: "9.800 €", Fase: "Negociación" },
            { Encargo: "Licencia LXP anual", Cliente: "IES Sierra Nevada", Importe: "6.200 €", Fase: "Propuesta enviada" },
            { Encargo: "Mundos360 pack básico", Cliente: "Fundación Aprende+", Importe: "3.400 €", Fase: "Cierre" },
          ],
        },
      },
    }),
    tag({
      id: "ventas-clientes",
      label: "Clientes",
      icon: "ti-address-book",
      notifications: 0,
      summary: "Cartera de clientes comerciales y su valor.",
      detail: {
        intro: "Clientes con relación comercial activa, ordenados por valor de cartera.",
        list: [
          { title: "Colegio Alameda", meta: "Cliente desde 2023 · 24.000 € LTV", status: "ok" },
          { title: "IES Sierra Nevada", meta: "Cliente desde 2024 · 11.200 € LTV", status: "ok" },
          { title: "Fundación Aprende+", meta: "Cliente nuevo", status: "neutral" },
        ],
      },
    }),
    tag({
      id: "canales",
      label: "Canales",
      icon: "ti-share",
      notifications: 0,
      summary: "Origen de los leads por canal de adquisición.",
      detail: {
        intro: "Distribución de leads activos según canal de entrada.",
        stats: [
          { label: "Referidos", value: "41%" },
          { label: "Web / Inbound", value: "33%" },
          { label: "Ferias y eventos", value: "18%" },
          { label: "Redes sociales", value: "8%" },
        ],
      },
    }),
  ],
};

const finanzasGlobal: Sector = {
  id: "finanzas",
  label: "Finanzas",
  icon: "ti-coin",
  description: "Caja y facturación del mes en curso.",
  widgetStats: [
    { label: "Facturación agosto", value: "22.150 €", trend: "+8%", trendDirection: "up" },
    { label: "Gasto agosto", value: "13.020 €" },
    { label: "Resultado", value: "9.130 €", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "prevision",
      label: "Previsión",
      icon: "ti-trending-up",
      notifications: 1,
      summary: "Ingresos y gastos previstos por canal.",
      detail: {
        intro: "Previsión de ingresos y gastos actualizada manualmente por los socios.",
        stats: [
          { label: "Ingresos previstos (Q3)", value: "68.000 €" },
          { label: "Gastos previstos (Q3)", value: "41.500 €" },
        ],
        note: "Los datos de previsión se actualizan manualmente hasta conectar con Banco y Facturación.",
      },
    }),
    tag({
      id: "contabilidad",
      label: "Contabilidad",
      icon: "ti-receipt-tax",
      notifications: 0,
      summary: "Documentos contables e impuestos del ejercicio.",
      detail: {
        intro: "Histórico contable migrado desde Excel, pendiente de completar con los últimos ejercicios.",
        list: [
          { title: "IVA 2º trimestre", meta: "Presentado", status: "ok" },
          { title: "IRPF 2º trimestre", meta: "Presentado", status: "ok" },
          { title: "Impuesto sociedades 2025", meta: "Pendiente", status: "warn" },
        ],
      },
    }),
    tag({
      id: "facturacion",
      label: "Facturación",
      icon: "ti-file-invoice",
      notifications: 2,
      summary: "Presupuestos y facturas emitidas.",
      detail: {
        intro: "Estado de presupuestos y facturas del mes en curso.",
        table: {
          columns: ["Nº", "Cliente", "Importe", "Estado"],
          rows: [
            { "Nº": "F-2026-041", Cliente: "Colegio Alameda", Importe: "3.400 €", Estado: "Cobrada" },
            { "Nº": "F-2026-042", Cliente: "IES Sierra Nevada", Importe: "2.100 €", Estado: "Pendiente" },
            { "Nº": "P-2026-018", Cliente: "Fundación Aprende+", Importe: "5.600 €", Estado: "Presupuesto" },
          ],
        },
      },
    }),
    tag({
      id: "banco",
      label: "Banco",
      icon: "ti-building-bank",
      notifications: 0,
      summary: "Estado de cuentas y deuda bancaria.",
      detail: {
        intro: "Estado de cuentas y seguimiento de la deuda bancaria activa.",
        stats: [
          { label: "Saldo cuentas", value: "38.240 €" },
          { label: "Deuda pendiente", value: "22.000 €" },
          { label: "Cuota mensual", value: "610 €" },
          { label: "Fin de pago", value: "mar 2029" },
        ],
        note: "Incluye préstamo de equipamiento VR — capital amortizado 34%.",
      },
    }),
  ],
};

const infraestructura: Sector = {
  id: "infraestructura",
  label: "Infraestructura",
  icon: "ti-server",
  description: "Estado de servicios, hosting y proveedores.",
  widgetStats: [
    { label: "Servicios activos", value: "14" },
    { label: "Renovaciones (30 días)", value: "2", trendDirection: "flat" },
    { label: "Gasto mensual infra", value: "820 €" },
  ],
  tags: [
    tag({
      id: "hostings",
      label: "Hostings",
      icon: "ti-cloud",
      notifications: 0,
      summary: "Hostings activos y su estado.",
      detail: {
        intro: "Servicios de hosting contratados para plataformas propias y de clientes.",
        table: {
          columns: ["Servicio", "Proveedor", "Vence", "Estado"],
          rows: [
            { Servicio: "LXP producción", Proveedor: "AWS", Vence: "—", Estado: "Activo" },
            { Servicio: "Panel interno", Proveedor: "Hostinger", Vence: "may 2027", Estado: "Activo" },
            { Servicio: "Mundos360 CDN", Proveedor: "Cloudflare", Vence: "—", Estado: "Activo" },
          ],
        },
      },
    }),
    tag({
      id: "inventario",
      label: "Inventario",
      icon: "ti-package",
      notifications: 0,
      summary: "Equipamiento físico de la empresa.",
      detail: {
        intro: "Equipamiento físico asignado y disponible (gafas VR, cámaras 360, portátiles).",
        stats: [
          { label: "Gafas VR", value: "12" },
          { label: "Cámaras 360°", value: "5" },
          { label: "Portátiles", value: "9" },
        ],
      },
    }),
    tag({
      id: "suscripciones",
      label: "Suscripciones",
      icon: "ti-refresh",
      notifications: 1,
      summary: "Software y SaaS contratados por el equipo.",
      detail: {
        intro: "Suscripciones activas a herramientas de software.",
        list: [
          { title: "Figma — plan Organización", meta: "45 €/mes", status: "neutral" },
          { title: "Notion — plan Business", meta: "32 €/mes", status: "neutral" },
          { title: "Adobe Creative Cloud", meta: "renueva en 6 días", status: "warn" },
        ],
      },
    }),
    tag({
      id: "freelances",
      label: "Freelances",
      icon: "ti-user-star",
      notifications: 0,
      summary: "Colaboradores externos activos.",
      detail: {
        intro: "Freelances con colaboración activa en proyectos en curso.",
        list: [
          { title: "Laura Méndez — modelado 3D", meta: "Mundos360 Alameda", status: "ok" },
          { title: "Iván Roca — desarrollo Unity", meta: "Experiencia VR salud", status: "ok" },
        ],
      },
    }),
    tag({
      id: "partners",
      label: "Partners",
      icon: "ti-plug-connected",
      notifications: 0,
      summary: "Alianzas estratégicas activas.",
      detail: {
        intro: "Partners tecnológicos y comerciales con acuerdo activo.",
        list: [
          { title: "Meta for Education", meta: "Acuerdo de distribución VR", status: "ok" },
          { title: "EducaLab", meta: "Colaboración de contenidos", status: "ok" },
        ],
      },
    }),
    tag({
      id: "colaboraciones",
      label: "Colaboraciones",
      icon: "ti-users",
      notifications: 0,
      summary: "Colaboraciones puntuales en curso.",
      detail: {
        intro: "Colaboraciones puntuales fuera de partnerships estables.",
        list: [{ title: "Universidad de Granada — piloto investigación", meta: "En curso", status: "neutral" }],
      },
    }),
  ],
};

const mail: Sector = {
  id: "mail",
  label: "Mail",
  icon: "ti-mail",
  description: "Bandejas comunes y personales del equipo.",
  widgetStats: [
    { label: "Sin leer (comunes)", value: "9" },
    { label: "Sin leer (personales)", value: "14" },
  ],
  tags: [
    tag({
      id: "mail-info",
      label: "info@eonesia.com",
      icon: "ti-mail-opened",
      notifications: 4,
      summary: "Bandeja general de contacto e información.",
      detail: {
        intro: "Bandeja compartida de contacto general. La integración real requiere OAuth de Google (pendiente).",
        note: "Mock de interfaz — se conectará vía Gmail API con OAuth de Google.",
      },
    }),
    tag({
      id: "mail-desarrollo",
      label: "desarrollo@eonesia.com",
      icon: "ti-code",
      notifications: 2,
      summary: "Bandeja técnica del equipo de desarrollo.",
      detail: {
        intro: "Bandeja compartida del equipo técnico.",
        note: "Mock de interfaz — se conectará vía Gmail API con OAuth de Google.",
      },
    }),
    tag({
      id: "mail-gmail",
      label: "Gmail corporativo",
      icon: "ti-brand-gmail",
      notifications: 0,
      summary: "Cuenta corporativa general en Gmail.",
      detail: {
        intro: "Cuenta corporativa en Gmail Workspace.",
        note: "Mock de interfaz — se conectará vía Gmail API con OAuth de Google.",
      },
    }),
    tag({
      id: "mail-alvaro",
      label: "Álvaro Linares",
      icon: "ti-user-circle",
      notifications: 3,
      summary: "Bandeja personal del socio.",
      detail: { intro: "Bandeja personal — visible solo para el socio y administradores autorizados." },
    }),
  ],
};

export const globalSectors: Sector[] = [hoy, producto, ventas, finanzasGlobal, infraestructura, mail];
