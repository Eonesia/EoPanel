export const COMPANY = {
  name: "Eonesia",
  legalName: "Eonesia Learning Experiences, S.L.",
  founded: "2022-06-01",
  sector: "Software educativo · experiencias inmersivas (360°/VR) · LXP",
  hq: "Granada, España",
};

export type Milestone = {
  date: string;
  title: string;
  description: string;
  kind: "fundacion" | "producto" | "equipo" | "cliente" | "hito";
};

export const MILESTONES: Milestone[] = [
  {
    date: "2022-06-01",
    title: "Fundación de Eonesia",
    description: "Rafa Dorado, Sergio Vegas, Carlos Gallego y Álvaro Linares fundan Eonesia en Granada.",
    kind: "fundacion",
  },
  {
    date: "2022-09-15",
    title: "Primer cliente piloto",
    description: "IES Sierra Nevada firma el primer piloto de experiencias educativas 360°.",
    kind: "cliente",
  },
  {
    date: "2023-01-20",
    title: "Lanzamiento MVP Mundos360",
    description: "Primera versión pública del producto insignia de experiencias 360°.",
    kind: "producto",
  },
  {
    date: "2023-05-10",
    title: "Primeros ingresos recurrentes",
    description: "Arranca la facturación mensual recurrente con los primeros 3 centros educativos.",
    kind: "hito",
  },
  {
    date: "2023-10-02",
    title: "Primer becario",
    description: "Se incorpora el primer becario en prácticas de desarrollo.",
    kind: "equipo",
  },
  {
    date: "2024-02-14",
    title: "Alianza con Meta for Education",
    description: "Acuerdo de distribución para el catálogo de experiencias en realidad virtual.",
    kind: "hito",
  },
  {
    date: "2024-06-01",
    title: "2º aniversario — 10 clientes activos",
    description: "Eonesia cumple dos años con 10 centros educativos activos y equipo estable de 4 socios.",
    kind: "hito",
  },
  {
    date: "2024-11-08",
    title: "Lanzamiento línea VR",
    description: "Primeras gafas VR desplegadas en centros piloto junto a contenidos propios.",
    kind: "producto",
  },
  {
    date: "2025-03-03",
    title: "Primera contratación de desarrollo",
    description: "Marta Ruiz se incorpora como empleada de desarrollo, primer puesto no fundador.",
    kind: "equipo",
  },
  {
    date: "2025-09-01",
    title: "3º aniversario — expansión regional",
    description: "Eonesia supera los 25 clientes activos y expande operación fuera de Granada.",
    kind: "hito",
  },
  {
    date: "2026-01-19",
    title: "Segundo becario incorporado",
    description: "Iker Peña se incorpora como becario de producto y diseño.",
    kind: "equipo",
  },
  {
    date: "2026-06-01",
    title: "4º aniversario",
    description: "Eonesia cumple 4 años en activo. 31 clientes activos, MRR de referencia ~14.900€.",
    kind: "hito",
  },
];
