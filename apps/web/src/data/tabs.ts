import type { Tab } from "./types";
import { globalSectors } from "./globalView";
import { produccionSectors } from "./produccion";
import { metricasSectors } from "./metricas";
import { learningSectors } from "./learning";
import { finanzasSectors } from "./finanzas";
import { onboardingSectors } from "./onboarding";

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
    available: true,
    sectors: produccionSectors,
  },
  {
    id: "metricas",
    label: "Métricas",
    icon: "ti-chart-bar",
    available: true,
    sectors: metricasSectors,
  },
  {
    id: "learning",
    label: "Learning",
    icon: "ti-school",
    available: true,
    sectors: learningSectors,
  },
  {
    id: "finanzas",
    label: "Finanzas",
    icon: "ti-coins",
    available: true,
    sectors: finanzasSectors,
  },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: "ti-users-group",
    available: true,
    sectors: onboardingSectors,
  },
];
