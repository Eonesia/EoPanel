import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Topbar } from "./Topbar";
import { NotificationsProvider } from "../../lib/notifications";
import { PermissionsProvider } from "../../lib/permissions";
import { TABS } from "../../data/tabs";

const socio = { id: "s1", name: "Socio Test", initials: "ST", email: "s@eonesia.com", role: "socio" as const };

vi.mock("../../lib/auth", () => ({
  useAuth: () => ({ profile: socio, isDemo: false, loginDemo: vi.fn(), logout: vi.fn() }),
}));

function renderTopbar() {
  return render(
    <MemoryRouter initialEntries={["/panel/global"]}>
      <NotificationsProvider>
        <PermissionsProvider>
          <Routes>
            <Route
              path="/panel/global"
              element={<Topbar crumbs={[{ label: "Vista global" }]} onMenuClick={() => {}} />}
            />
            <Route path="/panel/seguridad" element={<p>Página de seguridad</p>} />
          </Routes>
        </PermissionsProvider>
      </NotificationsProvider>
    </MemoryRouter>,
  );
}

const totalUnread = TABS.flatMap((t) => t.sectors)
  .flatMap((s) => s.tags)
  .reduce((sum, t) => sum + t.notifications, 0);

beforeEach(() => {
  localStorage.clear();
});

describe("Topbar notification bell", () => {
  it("includes the unread count in the bell's accessible name, not just visually on the badge", () => {
    // aria-label overrides all descendant text for the accessible name computation —
    // a static "Notificaciones" label would silently hide the badge count from screen readers.
    renderTopbar();
    expect(screen.getByRole("button", { name: `Notificaciones, ${totalUnread} sin leer` })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Notificaciones" })).not.toBeInTheDocument();
  });

  it("shows the total unread count on the bell and lists every unread tag inside", async () => {
    const user = userEvent.setup();
    renderTopbar();

    expect(screen.getByText(String(totalUnread))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: `Notificaciones, ${totalUnread} sin leer` }));
    expect(screen.getByText(`${totalUnread} sin leer`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marcar todas" })).toBeInTheDocument();
  });

  it("clears every notification and hides the bulk-clear button once clicked", async () => {
    const user = userEvent.setup();
    renderTopbar();

    await user.click(screen.getByRole("button", { name: `Notificaciones, ${totalUnread} sin leer` }));
    await user.click(screen.getByRole("button", { name: "Marcar todas" }));

    expect(screen.getByText("Todo al día")).toBeInTheDocument();
    expect(screen.getByText("No hay notificaciones pendientes.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Marcar todas" })).not.toBeInTheDocument();
    // the badge on the bell itself disappears too
    expect(screen.queryByText(String(totalUnread))).not.toBeInTheDocument();
    // and its accessible name drops the count along with it
    expect(screen.getByRole("button", { name: "Notificaciones" })).toBeInTheDocument();
  });
});

describe("Topbar account menu", () => {
  it("navigates to the security page from the profile dropdown", async () => {
    const user = userEvent.setup();
    renderTopbar();

    await user.click(screen.getByRole("button", { name: /Cuenta de/ }));
    await user.click(screen.getByRole("menuitem", { name: "Seguridad" }));

    expect(await screen.findByText("Página de seguridad")).toBeInTheDocument();
  });
});
