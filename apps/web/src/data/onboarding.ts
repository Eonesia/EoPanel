import type { Sector, Tag } from "./types";
import { MILESTONES } from "./company";

function tag(t: Tag): Tag {
  return t;
}

const proyectosRoles: Sector = {
  id: "proyectos-roles",
  label: "Proyectos y roles",
  icon: "ti-list-details",
  description: "Estado actual de cada persona del equipo.",
  widgetStats: [
    { label: "Personas activas", value: "6" },
    { label: "Proyectos con dueño asignado", value: "9/9", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "asignaciones",
      label: "Asignaciones actuales",
      icon: "ti-list-details",
      notifications: 0,
      summary: "Quién lleva qué ahora mismo.",
      detail: {
        intro: "Rol principal y proyecto activo de cada persona del equipo.",
        table: {
          columns: ["Persona", "Rol", "Proyecto activo"],
          rows: [
            { Persona: "Rafa Dorado", Rol: "Socio · Producto", "Proyecto activo": "Mundos360 Colegio Alameda" },
            { Persona: "Sergio Vegas", Rol: "Socio · Tecnología", "Proyecto activo": "LXP evaluaciones" },
            { Persona: "Carlos Gallego", Rol: "Socio · Finanzas", "Proyecto activo": "Migración contabilidad" },
            { Persona: "Álvaro Linares", Rol: "Socio · Comercial", "Proyecto activo": "VR Feria Salud" },
            { Persona: "Marta Ruiz", Rol: "Empleada · Desarrollo", "Proyecto activo": "Editor de escenarios 360°" },
            { Persona: "Iker Peña", Rol: "Becario · Producto y diseño", "Proyecto activo": "UX panel de progreso LXP" },
          ],
        },
      },
    }),
  ],
};

const responsabilidades: Sector = {
  id: "responsabilidades",
  label: "Responsabilidades",
  icon: "ti-user-check",
  description: "Reparto de áreas entre los 4 socios.",
  tags: [
    tag({
      id: "reparto",
      label: "Reparto de áreas",
      icon: "ti-user-check",
      notifications: 0,
      summary: "Área de responsabilidad de cada socio.",
      detail: {
        intro: "División de responsabilidades acordada entre los 4 socios fundadores.",
        list: [
          { title: "Rafa Dorado — Producto y contenidos", meta: "Mundos360, Factoría, VR", status: "ok" },
          { title: "Sergio Vegas — Tecnología y LXP", meta: "Plataforma, infraestructura, LXP", status: "ok" },
          { title: "Carlos Gallego — Finanzas y administración", meta: "Contabilidad, facturación, banco", status: "ok" },
          { title: "Álvaro Linares — Comercial y clientes", meta: "Ventas, CRM, propuestas", status: "ok" },
        ],
      },
    }),
  ],
};

const historial: Sector = {
  id: "historial",
  label: "Historial",
  icon: "ti-history",
  description: "Hitos de Eonesia desde su fundación en junio de 2022.",
  widgetStats: [
    { label: "Años en activo", value: "4" },
    { label: "Hitos registrados", value: String(MILESTONES.length) },
  ],
  tags: [
    tag({
      id: "hitos",
      label: "Línea de tiempo",
      icon: "ti-history",
      notifications: 0,
      summary: "Todos los hitos desde la fundación.",
      detail: {
        intro: "Historia de Eonesia, desde su fundación el 1 de junio de 2022 hasta hoy.",
        list: MILESTONES.slice()
          .reverse()
          .map((m) => ({
            title: m.title,
            meta: `${new Date(m.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })} — ${m.description}`,
            status: m.kind === "fundacion" ? "ok" : ("neutral" as const),
          })),
      },
    }),
  ],
};

const becarios: Sector = {
  id: "becarios",
  label: "Becarios",
  icon: "ti-backpack",
  description: "Seguimiento y tareas de becarios en prácticas.",
  widgetStats: [{ label: "Becarios activos", value: "1" }],
  tags: [
    tag({
      id: "seguimiento-becarios",
      label: "Seguimiento",
      icon: "ti-backpack",
      notifications: 1,
      summary: "Progreso y tareas asignadas.",
      detail: {
        intro: "Becarios activos, tutor asignado y tareas en curso.",
        table: {
          columns: ["Becario", "Área", "Tutor", "Inicio", "Tareas activas"],
          rows: [{ Becario: "Iker Peña", Área: "Producto y diseño", Tutor: "Sergio Vegas", Inicio: "19 ene 2026", "Tareas activas": "3" }],
        },
        list: [
          { title: "UX panel de progreso LXP", meta: "Iker Peña · en curso", status: "ok" },
          { title: "Test de usabilidad con profesorado", meta: "Iker Peña · pendiente de feedback", status: "warn" },
        ],
      },
    }),
  ],
};

export const onboardingSectors: Sector[] = [proyectosRoles, responsabilidades, historial, becarios];
