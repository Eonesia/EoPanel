export type Role = "socio" | "empleado" | "becario";

export type Profile = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
};

export const SOCIOS: Profile[] = [
  { id: "rd", name: "Rafa Dorado", initials: "RD", email: "rafa@eonesia.com", role: "socio" },
  { id: "sv", name: "Sergio Vegas", initials: "SV", email: "sergio@eonesia.com", role: "socio" },
  { id: "cg", name: "Carlos Gallego", initials: "CG", email: "carlos@eonesia.com", role: "socio" },
  { id: "al", name: "Álvaro Linares", initials: "AL", email: "alvaro@eonesia.com", role: "socio" },
];
