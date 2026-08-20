import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";
import { NotificationsProvider } from "../../lib/notifications";
import { PermissionsProvider } from "../../lib/permissions";
import { FavoritesProvider } from "../../lib/favorites";

const socio = { id: "s1", name: "Socio Test", initials: "ST", email: "s@eonesia.com", role: "socio" as const };

vi.mock("../../lib/auth", () => ({
  useAuth: () => ({ profile: socio, isDemo: false, loginDemo: vi.fn(), logout: vi.fn() }),
}));

function renderShell() {
  return render(
    <MemoryRouter>
      <NotificationsProvider>
        <PermissionsProvider>
          <FavoritesProvider>
            <AppShell crumbs={[{ label: "Vista global" }]}>
              <p>Contenido</p>
            </AppShell>
          </FavoritesProvider>
        </PermissionsProvider>
      </NotificationsProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());

describe("AppShell mobile drawer", () => {
  it("closes itself when a navigation link inside it is clicked", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: "Abrir menú de navegación" }));
    const dialog = screen.getByRole("dialog", { name: "Menú de navegación" });
    expect(dialog).toBeInTheDocument();

    // Click a nav link inside the drawer specifically (there's a duplicate desktop sidebar in the DOM).
    await user.click(within(dialog).getByRole("link", { name: /Producción/ }));

    expect(screen.queryByRole("dialog", { name: "Menú de navegación" })).not.toBeInTheDocument();
  });
});
