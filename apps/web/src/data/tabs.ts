import type { Sector, Tab } from "./types";
import { globalSectors } from "./globalView";

function stubSector(id: string, label: string, icon: string): Sector {
  return { id, label, icon, description: "", tags: [] };
}

export const TABS: Tab[] = [
  {
    id: "global",
    label: "Vista global",
    icon: "ti-layout-grid",
    available: true,
    sectors: globalSectors,
  },
  {
    id: "produccion",
    label: "Producción",
    icon: "ti-tools",
    available: false,
    sectors: [
      stubSector("todo", "ToDo", "ti-checklist"),
      stubSector("factoria", "Factoría", "ti-flask"),
      stubSector("propuestas", "Propuestas", "ti-file-description"),
      stubSector("proyectos", "Proyectos", "ti-briefcase"),
      stubSector("biblioteca", "Biblioteca", "ti-folders"),
    ],
  },
  {
    id: "metricas",
    label: "Métricas",
    icon: "ti-chart-bar",
    available: false,
    sectors: [
      stubSector("rrss", "RRSS", "ti-brand-instagram"),
      stubSector("b2c", "B2C", "ti-device-desktop"),
      stubSector("b2b", "B2B", "ti-handshake"),
      stubSector("lxp", "LXP", "ti-world"),
    ],
  },
  {
    id: "learning",
    label: "Learning",
    icon: "ti-school",
    available: false,
    sectors: [stubSector("lxp", "LXP", "ti-world"), stubSector("usuarios", "Usuarios", "ti-users")],
  },
  {
    id: "finanzas",
    label: "Finanzas",
    icon: "ti-coins",
    available: false,
    sectors: [
      stubSector("contabilidad", "Contabilidad", "ti-receipt-tax"),
      stubSector("recordatorios", "Recordatorios", "ti-bell"),
      stubSector("prevision", "Previsión", "ti-trending-up"),
      stubSector("banco", "Banco", "ti-building-bank"),
      stubSector("facturacion", "Facturación", "ti-file-invoice"),
      stubSector("crm", "CRM clientes", "ti-address-book"),
      stubSector("legal", "Legal", "ti-scale"),
    ],
  },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: "ti-users-group",
    available: false,
    sectors: [
      stubSector("proyectos-roles", "Proyectos y roles", "ti-list-details"),
      stubSector("responsabilidades", "Responsabilidades", "ti-user-check"),
      stubSector("historial", "Historial", "ti-history"),
      stubSector("becarios", "Becarios", "ti-graduation-cap"),
    ],
  },
];
