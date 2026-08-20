import { renderHook, act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PermissionsProvider, usePermissions } from "./permissions";
import type { Profile } from "../data/socios";

function setup() {
  return renderHook(() => usePermissions(), { wrapper: PermissionsProvider });
}

const socio: Profile = { id: "s1", name: "Socio Test", initials: "ST", email: "s@eonesia.com", role: "socio" };
const empleado: Profile = { id: "e1", name: "Empleado Test", initials: "ET", email: "e@eonesia.com", role: "empleado" };
const becario: Profile = { id: "b1", name: "Becario Test", initials: "BT", email: "b@eonesia.com", role: "becario" };

beforeEach(() => {
  localStorage.clear();
});

describe("permissions", () => {
  it("socios always have access, regardless of stored state", () => {
    const { result } = setup();
    expect(result.current.canViewTab(socio, "finanzas")).toBe(true);
    expect(result.current.canViewSector(socio, "finanzas", "banco")).toBe(true);
  });

  it("returns false for a null profile", () => {
    const { result } = setup();
    expect(result.current.canViewTab(null, "global")).toBe(false);
    expect(result.current.canViewSector(null, "global", "hoy")).toBe(false);
  });

  it("default seed: empleado/becario can see global and producción, not finanzas", () => {
    const { result } = setup();
    for (const profile of [empleado, becario]) {
      expect(result.current.canViewTab(profile, "global")).toBe(true);
      expect(result.current.canViewTab(profile, "produccion")).toBe(true);
      expect(result.current.canViewTab(profile, "finanzas")).toBe(false);
    }
  });

  it("a socio granting a tab makes it visible to that role only", () => {
    const { result } = setup();
    expect(result.current.canViewTab(empleado, "finanzas")).toBe(false);
    act(() => result.current.setTabEnabled("empleado", "finanzas", true));
    expect(result.current.canViewTab(empleado, "finanzas")).toBe(true);
    expect(result.current.canViewTab(becario, "finanzas")).toBe(false);
  });

  it("a sector can be revoked within an otherwise-enabled tab, without affecting sibling sectors", () => {
    const { result } = setup();
    // producción is enabled by default for empleado, with several sectors
    expect(result.current.canViewSector(empleado, "produccion", "todo")).toBe(true);
    expect(result.current.canViewSector(empleado, "produccion", "biblioteca")).toBe(true);

    act(() => result.current.setSectorEnabled("empleado", "produccion", "biblioteca", false));

    expect(result.current.canViewSector(empleado, "produccion", "biblioteca")).toBe(false);
    expect(result.current.canViewSector(empleado, "produccion", "todo")).toBe(true);
  });

  it("no sector is viewable once the whole tab is disabled, even with a prior sector override", () => {
    const { result } = setup();
    act(() => result.current.setSectorEnabled("empleado", "produccion", "todo", true));
    act(() => result.current.setTabEnabled("empleado", "produccion", false));
    expect(result.current.canViewSector(empleado, "produccion", "todo")).toBe(false);
  });

  it("persists a granted permission across a fresh provider mount", () => {
    const first = setup();
    act(() => first.result.current.setTabEnabled("becario", "learning", true));
    expect(first.result.current.canViewTab(becario, "learning")).toBe(true);

    const second = setup();
    expect(second.result.current.canViewTab(becario, "learning")).toBe(true);
  });
});

describe("per-user exceptions (spec §3: 'qué ve cada rol/usuario')", () => {
  it("has no override by default — everyone in a role follows the role's value", () => {
    const { result } = setup();
    expect(result.current.userTabOverride(empleado.id, "finanzas")).toBeUndefined();
    expect(result.current.canViewTab(empleado, "finanzas")).toBe(false);
  });

  it("an individual override grants access without changing the role default for anyone else", () => {
    const { result } = setup();
    const otherEmpleado = { ...empleado, id: "e2", name: "Otro Empleado" };

    act(() => result.current.setUserTabOverride(empleado.id, "finanzas", true));

    expect(result.current.canViewTab(empleado, "finanzas")).toBe(true);
    expect(result.current.canViewTab(otherEmpleado, "finanzas")).toBe(false);
    // the role default itself is untouched
    expect(result.current.state.roles.empleado.finanzas.enabled).toBe(false);
  });

  it("an individual override can also revoke access the role would otherwise grant", () => {
    const { result } = setup();
    expect(result.current.canViewTab(empleado, "produccion")).toBe(true); // role default is true

    act(() => result.current.setUserTabOverride(empleado.id, "produccion", false));

    expect(result.current.canViewTab(empleado, "produccion")).toBe(false);
    expect(result.current.state.roles.empleado.produccion.enabled).toBe(true); // role default untouched
  });

  it("clearing an override falls back to the role default again", () => {
    const { result } = setup();
    act(() => result.current.setUserTabOverride(empleado.id, "finanzas", true));
    expect(result.current.canViewTab(empleado, "finanzas")).toBe(true);

    act(() => result.current.clearUserTabOverride(empleado.id, "finanzas"));

    expect(result.current.userTabOverride(empleado.id, "finanzas")).toBeUndefined();
    expect(result.current.canViewTab(empleado, "finanzas")).toBe(false);
  });

  it("a user-level tab override does not affect that tab's sector visibility, which still follows the role", () => {
    const { result } = setup();
    act(() => result.current.setSectorEnabled("empleado", "produccion", "biblioteca", false));
    act(() => result.current.setUserTabOverride(empleado.id, "produccion", true));

    // tab visible thanks to the (redundant, since role already allowed it) override,
    // but the role's per-sector revocation still applies
    expect(result.current.canViewSector(empleado, "produccion", "biblioteca")).toBe(false);
    expect(result.current.canViewSector(empleado, "produccion", "todo")).toBe(true);
  });

  it("socios are unaffected by any user-level override", () => {
    const { result } = setup();
    act(() => result.current.setUserTabOverride(socio.id, "finanzas", false));
    expect(result.current.canViewTab(socio, "finanzas")).toBe(true);
  });

  it("persists an individual override across a fresh provider mount", () => {
    const first = setup();
    act(() => first.result.current.setUserTabOverride(becario.id, "metricas", true));

    const second = setup();
    expect(second.result.current.canViewTab(becario, "metricas")).toBe(true);
  });
});
