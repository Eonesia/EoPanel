import { describe, expect, it } from "vitest";
import { rankMatch, searchAndRank } from "./search";

describe("rankMatch", () => {
  it("ranks an exact label match best", () => {
    expect(rankMatch({ label: "UI", breadcrumb: "Producción", searchText: "UI producción" }, "UI")).toBe(0);
  });

  it("ranks a label-starts-with match above a mere substring", () => {
    const startsWith = rankMatch({ label: "Usuarios", breadcrumb: "Learning", searchText: "Usuarios Learning" }, "Us");
    const contains = rankMatch({ label: "Campus", breadcrumb: "Learning", searchText: "Campus Learning" }, "Us");
    expect(startsWith).toBeLessThan(contains);
  });

  it("does not let a coincidental substring in a longer word outrank the real item", () => {
    // "seg-UI-miento" contains "ui" as a substring but isn't the UI tag.
    const decoy = rankMatch(
      { label: "Seguimiento de proyectos", breadcrumb: "Vista global · Hoy", searchText: "Seguimiento de proyectos" },
      "UI",
    );
    const real = rankMatch({ label: "UI", breadcrumb: "Producción · Factoría", searchText: "UI" }, "UI");
    expect(real).toBeLessThan(decoy);
  });

  it("returns -1 (excluded) when nothing matches", () => {
    expect(rankMatch({ label: "Banco", breadcrumb: "Finanzas", searchText: "Banco Finanzas" }, "zzz")).toBe(-1);
  });

  it("is case-insensitive", () => {
    expect(rankMatch({ label: "Facturación", breadcrumb: "Finanzas", searchText: "Facturación" }, "FACTURACIÓN")).toBe(0);
  });
});

describe("searchAndRank", () => {
  const items = [
    { label: "Seguimiento de proyectos", breadcrumb: "Vista global · Hoy", searchText: "Seguimiento de proyectos" },
    { label: "UI", breadcrumb: "Producción · Factoría", searchText: "UI" },
    { label: "UX", breadcrumb: "Producción · Factoría", searchText: "UX" },
  ];

  it("puts the exact/prefix match first regardless of input order", () => {
    const results = searchAndRank(items, "UI");
    expect(results[0].label).toBe("UI");
  });

  it("excludes non-matching items", () => {
    const results = searchAndRank(items, "zzz");
    expect(results).toHaveLength(0);
  });

  it("returns items unranked (original order) when the query is empty", () => {
    const results = searchAndRank(items, "", 2);
    expect(results).toEqual(items.slice(0, 2));
  });

  it("respects the limit", () => {
    const results = searchAndRank(items, "U", 1);
    expect(results).toHaveLength(1);
  });
});
