import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Profile, Role } from "../data/socios";
import { TABS } from "../data/tabs";
import { useLocalStorage } from "./useLocalStorage";

type TabPermission = { enabled: boolean; sectors: Record<string, boolean> };
type NonSocioRole = Exclude<Role, "socio">;
type PermissionsState = Record<NonSocioRole, Record<string, TabPermission>>;

function defaultTabPermission(enabled: boolean): TabPermission {
  return { enabled, sectors: {} };
}

/** Accesos por defecto — los socios editan esto desde el panel de administración. */
function seedPermissions(): PermissionsState {
  return {
    empleado: {
      global: defaultTabPermission(true),
      produccion: defaultTabPermission(true),
      metricas: defaultTabPermission(false),
      learning: defaultTabPermission(false),
      finanzas: defaultTabPermission(false),
      onboarding: defaultTabPermission(true),
    },
    becario: {
      global: defaultTabPermission(true),
      produccion: defaultTabPermission(true),
      metricas: defaultTabPermission(false),
      learning: defaultTabPermission(false),
      finanzas: defaultTabPermission(false),
      onboarding: defaultTabPermission(false),
    },
  };
}

type PermissionsContextValue = {
  state: PermissionsState;
  canViewTab: (profile: Profile | null, tabId: string) => boolean;
  canViewSector: (profile: Profile | null, tabId: string, sectorId: string) => boolean;
  setTabEnabled: (role: NonSocioRole, tabId: string, enabled: boolean) => void;
  setSectorEnabled: (role: NonSocioRole, tabId: string, sectorId: string, enabled: boolean) => void;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<PermissionsState>("eopanel-permissions", seedPermissions());

  function canViewTab(profile: Profile | null, tabId: string) {
    if (!profile) return false;
    if (profile.role === "socio") return true;
    return state[profile.role]?.[tabId]?.enabled ?? false;
  }

  function canViewSector(profile: Profile | null, tabId: string, sectorId: string) {
    if (!profile) return false;
    if (profile.role === "socio") return true;
    const tab = state[profile.role]?.[tabId];
    if (!tab?.enabled) return false;
    return tab.sectors[sectorId] ?? true;
  }

  function setTabEnabled(role: NonSocioRole, tabId: string, enabled: boolean) {
    setState((prev) => ({
      ...prev,
      [role]: { ...prev[role], [tabId]: { ...(prev[role][tabId] ?? defaultTabPermission(enabled)), enabled } },
    }));
  }

  function setSectorEnabled(role: NonSocioRole, tabId: string, sectorId: string, enabled: boolean) {
    setState((prev) => {
      const current = prev[role][tabId] ?? defaultTabPermission(true);
      return {
        ...prev,
        [role]: { ...prev[role], [tabId]: { ...current, sectors: { ...current.sectors, [sectorId]: enabled } } },
      };
    });
  }

  const value = useMemo(
    () => ({ state, canViewTab, canViewSector, setTabEnabled, setSectorEnabled }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state],
  );

  return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions debe usarse dentro de <PermissionsProvider>");
  return ctx;
}

/** Utilidad para la pantalla de administración: lista de pestañas con sus sectores, en el mismo orden del nav. */
export function permissionableTabs() {
  return TABS.filter((t) => t.id !== "global");
}
