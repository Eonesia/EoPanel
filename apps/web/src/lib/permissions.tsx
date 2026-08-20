import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Profile, Role } from "../data/socios";
import { TABS } from "../data/tabs";
import { useLocalStorage } from "./useLocalStorage";

type TabPermission = { enabled: boolean; sectors: Record<string, boolean> };
type NonSocioRole = Exclude<Role, "socio">;

type PermissionsState = {
  /** Valores por defecto de cada rol — lo que ve un Empleado/Becario si nadie los excepciona. */
  roles: Record<NonSocioRole, Record<string, TabPermission>>;
  /**
   * Excepciones por persona concreta (spec §3: "los socios deciden qué ve cada
   * rol/usuario"). Solo a nivel de pestaña — el detalle por sector sigue
   * viniendo de los valores del rol una vez la pestaña está visible para esa
   * persona. Ausente = esa pestaña sigue el valor del rol sin excepción.
   */
  users: Record<string, Record<string, boolean>>;
};

function defaultTabPermission(enabled: boolean): TabPermission {
  return { enabled, sectors: {} };
}

/** Accesos por defecto — los socios editan esto desde el panel de administración. */
function seedPermissions(): PermissionsState {
  return {
    roles: {
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
    },
    users: {},
  };
}

type PermissionsContextValue = {
  state: PermissionsState;
  canViewTab: (profile: Profile | null, tabId: string) => boolean;
  canViewSector: (profile: Profile | null, tabId: string, sectorId: string) => boolean;
  setTabEnabled: (role: NonSocioRole, tabId: string, enabled: boolean) => void;
  setSectorEnabled: (role: NonSocioRole, tabId: string, sectorId: string, enabled: boolean) => void;
  /** Excepción explícita para una persona concreta en una pestaña — gana al valor de su rol. */
  userTabOverride: (userId: string, tabId: string) => boolean | undefined;
  setUserTabOverride: (userId: string, tabId: string, enabled: boolean) => void;
  /** Quita la excepción — esa persona vuelve a seguir el valor por defecto de su rol en esa pestaña. */
  clearUserTabOverride: (userId: string, tabId: string) => void;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<PermissionsState>("eopanel-permissions", seedPermissions());

  function canViewTab(profile: Profile | null, tabId: string) {
    if (!profile) return false;
    if (profile.role === "socio") return true;
    const override = state.users[profile.id]?.[tabId];
    if (override !== undefined) return override;
    return state.roles[profile.role]?.[tabId]?.enabled ?? false;
  }

  function canViewSector(profile: Profile | null, tabId: string, sectorId: string) {
    if (!profile) return false;
    if (profile.role === "socio") return true;
    if (!canViewTab(profile, tabId)) return false;
    const tab = state.roles[profile.role]?.[tabId];
    return tab?.sectors[sectorId] ?? true;
  }

  function setTabEnabled(role: NonSocioRole, tabId: string, enabled: boolean) {
    setState((prev) => ({
      ...prev,
      roles: {
        ...prev.roles,
        [role]: {
          ...prev.roles[role],
          [tabId]: { ...(prev.roles[role][tabId] ?? defaultTabPermission(enabled)), enabled },
        },
      },
    }));
  }

  function setSectorEnabled(role: NonSocioRole, tabId: string, sectorId: string, enabled: boolean) {
    setState((prev) => {
      const current = prev.roles[role][tabId] ?? defaultTabPermission(true);
      return {
        ...prev,
        roles: {
          ...prev.roles,
          [role]: { ...prev.roles[role], [tabId]: { ...current, sectors: { ...current.sectors, [sectorId]: enabled } } },
        },
      };
    });
  }

  function userTabOverride(userId: string, tabId: string) {
    return state.users[userId]?.[tabId];
  }

  function setUserTabOverride(userId: string, tabId: string, enabled: boolean) {
    setState((prev) => ({
      ...prev,
      users: { ...prev.users, [userId]: { ...prev.users[userId], [tabId]: enabled } },
    }));
  }

  function clearUserTabOverride(userId: string, tabId: string) {
    setState((prev) => {
      const rest = { ...(prev.users[userId] ?? {}) };
      delete rest[tabId];
      return { ...prev, users: { ...prev.users, [userId]: rest } };
    });
  }

  const value = useMemo(
    () => ({
      state,
      canViewTab,
      canViewSector,
      setTabEnabled,
      setSectorEnabled,
      userTabOverride,
      setUserTabOverride,
      clearUserTabOverride,
    }),
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
