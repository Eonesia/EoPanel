import type { FormField, Sector, Tag } from "./types";

function tag(t: Tag): Tag {
  return t;
}

const rrssFields: FormField[] = [
  { id: "fecha", label: "Fecha", type: "date" },
  { id: "seguidores", label: "Seguidores", type: "number", placeholder: "12500" },
  { id: "interacciones", label: "Interacciones", type: "number", placeholder: "340" },
];

const rrss: Sector = {
  id: "rrss",
  label: "RRSS",
  icon: "ti-brand-instagram",
  description: "KPIs de redes sociales — entrada manual hasta conectar cada API.",
  widgetStats: [
    { label: "Alcance total (mes)", value: "48.200", trend: "+11%", trendDirection: "up" },
    { label: "Seguidores totales", value: "9.640", trend: "+3,4%", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "web",
      label: "Web",
      icon: "ti-world",
      notifications: 0,
      summary: "Tráfico y visitas de eonesia.com.",
      detail: {
        intro: "Métricas de tráfico web. Registro manual hasta conectar Google Analytics.",
        form: { fields: [{ id: "fecha", label: "Fecha", type: "date" }, { id: "visitas", label: "Visitas", type: "number", placeholder: "1200" }] },
        integration: { provider: "Google Analytics 4", status: "no_conectado", note: "Conectar cuenta de GA4 para sustituir el registro manual por datos automáticos." },
      },
    }),
    tag({
      id: "linkedin",
      label: "Linkedin",
      icon: "ti-brand-linkedin",
      notifications: 0,
      summary: "Seguidores e interacciones en LinkedIn.",
      detail: {
        intro: "Sin API de LinkedIn todavía — registro manual semanal.",
        form: { fields: rrssFields },
        integration: { provider: "LinkedIn API", status: "no_conectado", note: "Requiere app aprobada por LinkedIn y credenciales — pendiente." },
      },
    }),
    tag({
      id: "instagram",
      label: "Instagram",
      icon: "ti-brand-instagram",
      notifications: 1,
      summary: "Seguidores e interacciones en Instagram.",
      detail: {
        intro: "Sin API de Meta todavía — registro manual semanal.",
        form: { fields: rrssFields },
        integration: { provider: "Meta Graph API (Instagram)", status: "no_conectado", note: "Requiere cuenta profesional vinculada a una página de Facebook y app de Meta aprobada." },
      },
    }),
    tag({
      id: "facebook",
      label: "Facebook",
      icon: "ti-brand-facebook",
      notifications: 0,
      summary: "Seguidores e interacciones en Facebook.",
      detail: {
        intro: "Sin API de Meta todavía — registro manual semanal.",
        form: { fields: rrssFields },
        integration: { provider: "Meta Graph API (Facebook)", status: "no_conectado", note: "Misma app de Meta que Instagram — pendiente de aprobación." },
      },
    }),
    tag({
      id: "tiktok",
      label: "Tiktok",
      icon: "ti-brand-tiktok",
      notifications: 0,
      summary: "Seguidores e interacciones en TikTok.",
      detail: {
        intro: "Sin API de TikTok todavía — registro manual semanal.",
        form: { fields: rrssFields },
        integration: { provider: "TikTok for Business API", status: "no_conectado", note: "Requiere cuenta de negocio y solicitud de acceso a la API — pendiente." },
      },
    }),
  ],
};

const b2c: Sector = {
  id: "b2c",
  label: "B2C",
  icon: "ti-device-desktop",
  description: "SaaS y promociones dirigidas a consumidor final.",
  widgetStats: [
    { label: "Usuarios SaaS activos", value: "1.240", trend: "+6%", trendDirection: "up" },
    { label: "Conversión promo", value: "4,1%" },
  ],
  tags: [
    tag({
      id: "saas",
      label: "SaaS",
      icon: "ti-cloud-computing",
      notifications: 0,
      summary: "Métricas del producto SaaS de consumo.",
      detail: {
        intro: "Actividad de la capa SaaS orientada a usuario final (familias/estudiantes).",
        stats: [
          { label: "Usuarios activos (mes)", value: "1.240", trend: "+6%", trendDirection: "up" },
          { label: "Suscripciones de pago", value: "310" },
          { label: "Churn", value: "2,1%", trendDirection: "down" },
        ],
      },
    }),
    tag({
      id: "promociones",
      label: "Promociones",
      icon: "ti-discount",
      notifications: 0,
      summary: "Campañas promocionales activas.",
      detail: {
        intro: "Campañas de descuento o promoción activas para B2C.",
        list: [{ title: "Vuelta al cole -20% primer trimestre", meta: "Activa hasta 15 sep", status: "ok" }],
      },
    }),
  ],
};

const b2b: Sector = {
  id: "b2b",
  label: "B2B",
  icon: "ti-heart-handshake",
  description: "Encargos y colaboraciones con organizaciones.",
  widgetStats: [
    { label: "Cuentas B2B activas", value: "31" },
    { label: "Valor medio de encargo", value: "5.200 €" },
  ],
  tags: [
    tag({
      id: "b2b-encargos",
      label: "Encargos",
      icon: "ti-clipboard-list",
      notifications: 1,
      summary: "Encargos corporativos/institucionales activos.",
      detail: {
        intro: "Encargos B2B activos fuera del canal educativo estándar.",
        list: [{ title: "Experiencia VR corporativa — Cámara de Comercio", meta: "En producción", status: "ok" }],
      },
    }),
    tag({
      id: "b2b-colaboraciones",
      label: "Colaboraciones",
      icon: "ti-building-community",
      notifications: 0,
      summary: "Colaboraciones institucionales activas.",
      detail: {
        intro: "Colaboraciones con instituciones y administraciones.",
        list: [{ title: "Universidad de Granada — piloto investigación", status: "neutral" }],
      },
    }),
  ],
};

const lxpMetricas: Sector = {
  id: "lxp",
  label: "LXP",
  icon: "ti-world",
  description: "Métricas generales de la plataforma educativa.",
  widgetStats: [
    { label: "Sesiones (mes)", value: "18.400", trend: "+9%", trendDirection: "up" },
    { label: "Tiempo medio/sesión", value: "12m 40s" },
  ],
  tags: [
    tag({
      id: "lxp-uso",
      label: "Uso",
      icon: "ti-chart-line",
      notifications: 0,
      summary: "Actividad general de la plataforma.",
      detail: {
        intro: "Uso agregado de la LXP en el periodo actual.",
        stats: [
          { label: "Usuarios activos", value: "2.180" },
          { label: "Cursos completados", value: "640", trend: "+14%", trendDirection: "up" },
        ],
        integration: { provider: "LXP (AWS / Supabase)", status: "pendiente", note: "Definir si se consume la base de datos de la LXP directamente o se replica — ver docs/spec.md §9." },
      },
    }),
    tag({
      id: "lxp-rendimiento",
      label: "Rendimiento",
      icon: "ti-gauge",
      notifications: 0,
      summary: "Salud técnica de la plataforma.",
      detail: {
        intro: "Indicadores técnicos de rendimiento de la LXP.",
        stats: [
          { label: "Uptime (30 días)", value: "99,92%" },
          { label: "Latencia media", value: "180ms" },
        ],
      },
    }),
  ],
};

export const metricasSectors: Sector[] = [rrss, b2c, b2b, lxpMetricas];
