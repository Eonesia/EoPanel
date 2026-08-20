import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";
import { NotificationsProvider } from "../../lib/notifications";
import { PermissionsProvider } from "../../lib/permissions";
import { FavoritesProvider } from "../../lib/favorites";
import { TABS } from "../../data/tabs";

const socio = { id: "s1", name: "Socio Test", initials: "ST", email: "s@eonesia.com", role: "socio" as const };

vi.mock("../../lib/auth", () => ({
  useAuth: () => ({ profile: socio }),
}));

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NotificationsProvider>
        <PermissionsProvider>
          <FavoritesProvider>
            <Routes>
              <Route path="/panel/:tabId/*" element={<Sidebar />} />
            </Routes>
          </FavoritesProvider>
        </PermissionsProvider>
      </NotificationsProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe("Sidebar", () => {
  it("lists every tab as a nav link", () => {
    renderAt("/panel/global");
    for (const tab of TABS) {
      expect(screen.getByRole("link", { name: new RegExp(tab.label) })).toBeInTheDocument();
    }
  });

  it("marks the current route's tab as the active link", () => {
    renderAt("/panel/finanzas");
    expect(screen.getByRole("link", { name: /Finanzas/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Producción/ })).not.toHaveAttribute("aria-current");
  });

  it("renders exactly one traveling indicator behind the active tab, not one per tab", () => {
    const { container } = renderAt("/panel/global");
    // The indicator is the sole aria-hidden absolutely-positioned element in the tab list.
    const indicators = container.querySelectorAll('[aria-hidden="true"].brand-gradient');
    expect(indicators.length).toBe(1);
  });

  it("still shows exactly one indicator after switching to a different tab", () => {
    const { container } = renderAt("/panel/onboarding");
    expect(screen.getByRole("link", { name: /Onboarding/ })).toHaveAttribute("aria-current", "page");
    expect(container.querySelectorAll('[aria-hidden="true"].brand-gradient').length).toBe(1);
  });
});
