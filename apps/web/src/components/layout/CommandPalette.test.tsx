import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CommandPalette } from "./CommandPalette";
import { NotificationsProvider, useNotifications } from "../../lib/notifications";
import { PermissionsProvider } from "../../lib/permissions";
import { TABS } from "../../data/tabs";

const socio = { id: "s1", name: "Socio Test", initials: "ST", email: "s@eonesia.com", role: "socio" as const };

vi.mock("../../lib/auth", () => ({
  useAuth: () => ({ profile: socio }),
}));

// Exposes markTagRead to the test without reaching into the provider's internals.
function MarkReadButton({ tagId }: { tagId: string }) {
  const { markTagRead } = useNotifications();
  return <button onClick={() => markTagRead(tagId)}>mark-read-{tagId}</button>;
}

function renderPalette(extra: React.ReactNode = null) {
  return render(
    <MemoryRouter>
      <NotificationsProvider>
        <PermissionsProvider>
          {extra}
          <CommandPalette open onClose={() => {}} />
        </PermissionsProvider>
      </NotificationsProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe("CommandPalette notification badges", () => {
  it("reflects the current unread count for a tag that has one", () => {
    const tagWithCount = TABS.flatMap((t) => t.sectors)
      .flatMap((s) => s.tags)
      .find((t) => t.notifications > 0)!;

    renderPalette();
    const item = screen.getByText(tagWithCount.label).closest("button")!;
    expect(within(item).getByText(String(tagWithCount.notifications))).toBeInTheDocument();
  });

  it("stops showing the badge once that tag is marked as read elsewhere in the app — no stale memo", async () => {
    const tagWithCount = TABS.flatMap((t) => t.sectors)
      .flatMap((s) => s.tags)
      .find((t) => t.notifications > 0)!;
    const user = userEvent.setup();

    renderPalette(<MarkReadButton tagId={tagWithCount.id} />);

    const itemBefore = screen.getByText(tagWithCount.label).closest("button")!;
    expect(within(itemBefore).getByText(String(tagWithCount.notifications))).toBeInTheDocument();

    await user.click(screen.getByText(`mark-read-${tagWithCount.id}`));

    const itemAfter = screen.getByText(tagWithCount.label).closest("button")!;
    expect(within(itemAfter).queryByText(String(tagWithCount.notifications))).not.toBeInTheDocument();
  });
});
