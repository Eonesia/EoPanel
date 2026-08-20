import type { Sector, Tag } from "./types";

function tag(t: Tag): Tag {
  return t;
}

const lxp: Sector = {
  id: "lxp",
  label: "LXP",
  icon: "ti-world",
  description: "Estado de la plataforma educativa (Learning Experience Platform).",
  widgetStats: [
    { label: "Centros con LXP activa", value: "22" },
    { label: "Cursos publicados", value: "146" },
    { label: "Finalización media", value: "71%", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "cursos",
      label: "Cursos",
      icon: "ti-book-2",
      notifications: 0,
      summary: "Catálogo de cursos y su rendimiento.",
      detail: {
        intro: "Cursos publicados en la LXP con mejor y peor tasa de finalización.",
        table: {
          columns: ["Curso", "Matriculados", "Finalización"],
          rows: [
            { Curso: "Ciencias — Sistema solar interactivo", Matriculados: "412", Finalización: "84%" },
            { Curso: "Historia — Recorrido Al-Ándalus", Matriculados: "290", Finalización: "76%" },
            { Curso: "Química — Laboratorio inmersivo", Matriculados: "198", Finalización: "58%" },
          ],
        },
      },
    }),
    tag({
      id: "contenidos",
      label: "Contenidos",
      icon: "ti-library",
      notifications: 1,
      summary: "Estado de producción de nuevos contenidos.",
      detail: {
        intro: "Contenidos educativos en distintas fases de producción para la LXP.",
        list: [
          { title: "Unidad de geografía — relieve de la península", meta: "En revisión pedagógica", status: "warn" },
          { title: "Unidad de biología — ecosistemas", meta: "Publicada", status: "ok" },
        ],
      },
    }),
    tag({
      id: "certificaciones",
      label: "Certificaciones",
      icon: "ti-certificate",
      notifications: 0,
      summary: "Certificados emitidos a estudiantes.",
      detail: {
        intro: "Certificados de finalización emitidos automáticamente por la plataforma.",
        stats: [{ label: "Certificados emitidos (curso actual)", value: "1.024" }],
      },
    }),
  ],
};

const usuarios: Sector = {
  id: "usuarios",
  label: "Usuarios",
  icon: "ti-users",
  description: "Altas, actividad y centros educativos en la LXP.",
  widgetStats: [
    { label: "Usuarios totales", value: "3.640" },
    { label: "Altas este mes", value: "212", trend: "+18%", trendDirection: "up" },
  ],
  tags: [
    tag({
      id: "altas",
      label: "Altas",
      icon: "ti-user-plus",
      notifications: 2,
      summary: "Nuevas altas de estudiantes y docentes.",
      detail: {
        intro: "Altas recientes en la plataforma, por rol.",
        stats: [
          { label: "Estudiantes nuevos (mes)", value: "184" },
          { label: "Docentes nuevos (mes)", value: "28" },
        ],
      },
    }),
    tag({
      id: "centros",
      label: "Centros",
      icon: "ti-building",
      notifications: 0,
      summary: "Centros educativos usando la LXP.",
      detail: {
        intro: "Centros con licencia activa en la plataforma.",
        table: {
          columns: ["Centro", "Usuarios", "Estado"],
          rows: [
            { Centro: "Colegio Alameda", Usuarios: "412", Estado: "Activo" },
            { Centro: "IES Sierra Nevada", Usuarios: "298", Estado: "Activo" },
            { Centro: "Fundación Aprende+", Usuarios: "86", Estado: "Prueba" },
          ],
        },
      },
    }),
    tag({
      id: "actividad",
      label: "Actividad",
      icon: "ti-activity",
      notifications: 0,
      summary: "Uso diario/semanal agregado.",
      detail: {
        intro: "Actividad reciente agregada de toda la base de usuarios.",
        stats: [
          { label: "Usuarios activos (7 días)", value: "2.310" },
          { label: "Sesiones/usuario (media)", value: "3,2" },
        ],
      },
    }),
  ],
};

export const learningSectors: Sector[] = [lxp, usuarios];
