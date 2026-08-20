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
