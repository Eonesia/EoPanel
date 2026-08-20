export type Role = "socio" | "empleado" | "becario";

export type Profile = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  title?: string;
};

export const SOCIOS: Profile[] = [
  { id: "rd", name: "Rafa Dorado", initials: "RD", email: "rafa@eonesia.com", role: "socio", title: "Socio · Producto" },
  { id: "sv", name: "Sergio Vegas", initials: "SV", email: "sergio@eonesia.com", role: "socio", title: "Socio · Tecnología" },
  { id: "cg", name: "Carlos Gallego", initials: "CG", email: "carlos@eonesia.com", role: "socio", title: "Socio · Finanzas" },
  { id: "al", name: "Álvaro Linares", initials: "AL", email: "alvaro@eonesia.com", role: "socio", title: "Socio · Comercial" },
];

/** Perfiles de equipo no socios — usados para demostrar el sistema de permisos granular. */
export const TEAM: Profile[] = [
  { id: "mr", name: "Marta Ruiz", initials: "MR", email: "marta@eonesia.com", role: "empleado", title: "Empleada · Desarrollo" },
  { id: "ip", name: "Iker Peña", initials: "IP", email: "iker@eonesia.com", role: "becario", title: "Becario · Producto y diseño" },
];

export const ALL_PROFILES: Profile[] = [...SOCIOS, ...TEAM];
