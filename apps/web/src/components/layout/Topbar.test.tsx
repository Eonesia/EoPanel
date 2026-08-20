import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
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
    <MemoryRouter>
      <NotificationsProvider>
        <PermissionsProvider>
          <Topbar crumbs={[{ label: "Vista global" }]} onMenuClick={() => {}} />
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
  it("shows the total unread count on the bell and lists every unread tag inside", async () => {
    const user = userEvent.setup();
    renderTopbar();

    expect(screen.getByText(String(totalUnread))).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Notificaciones" }));
    expect(screen.getByText(`${totalUnread} sin leer`)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Marcar todas" })).toBeInTheDocument();
  });

  it("clears every notification and hides the bulk-clear button once clicked", async () => {
    const user = userEvent.setup();
    renderTopbar();

    await user.click(screen.getByRole("button", { name: "Notificaciones" }));
    await user.click(screen.getByRole("button", { name: "Marcar todas" }));

    expect(screen.getByText("Todo al día")).toBeInTheDocument();
    expect(screen.getByText("No hay notificaciones pendientes.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Marcar todas" })).not.toBeInTheDocument();
    // the badge on the bell itself disappears too
    expect(screen.queryByText(String(totalUnread))).not.toBeInTheDocument();
  });
});
