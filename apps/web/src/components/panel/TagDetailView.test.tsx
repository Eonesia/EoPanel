import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { TagDetailView } from "./TagDetailView";
import { NotificationsProvider } from "../../lib/notifications";
import { FavoritesProvider } from "../../lib/favorites";
import { ToastProvider } from "../../lib/toast";
import { TABS } from "../../data/tabs";

function renderTag(tabId: string, sectorId: string, tagId: string) {
  const tab = TABS.find((t) => t.id === tabId)!;
  const sector = tab.sectors.find((s) => s.id === sectorId)!;
  const tag = sector.tags.find((t) => t.id === tagId)!;
  return render(
    <MemoryRouter>
      <ToastProvider>
        <NotificationsProvider>
          <FavoritesProvider>
            <TagDetailView tabId={tabId} sector={sector} tag={tag} />
          </FavoritesProvider>
        </NotificationsProvider>
      </ToastProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe("TagDetailView wiring", () => {
  it("passes the ledger's totalField through so Facturación shows a real total, not just rows", () => {
    // Regression test: EditableLedger got a totalField prop that TagDetailView
    // forgot to forward, so the feature worked in isolation but never rendered
    // on the actual Facturación page.
    renderTag("finanzas", "facturacion", "facturas");
    expect(screen.getByText("Total")).toBeInTheDocument();
    // 3.400 + 2.100 + 3.400 from the seeded invoices in apps/web/src/data/finanzas.ts
    expect(screen.getByText("8.900 €")).toBeInTheDocument();
  });
});
