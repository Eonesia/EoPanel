import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ManualEntryForm } from "./ManualEntryForm";
import type { FormField } from "../../data/types";

const showToast = vi.fn();
vi.mock("../../lib/toast", async () => {
  const actual = await vi.importActual<typeof import("../../lib/toast")>("../../lib/toast");
  return { ...actual, useToast: () => ({ showToast }) };
});

const FIELDS: FormField[] = [
  { id: "canal", label: "Canal", type: "text", placeholder: "Instagram" },
  { id: "seguidores", label: "Seguidores", type: "number", placeholder: "1200" },
];

beforeEach(() => {
  localStorage.clear();
  showToast.mockClear();
});

afterEach(cleanup);

describe("ManualEntryForm", () => {
  it("refuses to submit with empty fields and shows an error toast", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm tagId="rrss-test" fields={FIELDS} />);

    await user.click(screen.getByRole("button", { name: /guardar registro/i }));

    expect(showToast).toHaveBeenCalledWith(expect.stringMatching(/completa todos los campos/i), "error");
    expect(screen.queryByText(/Canal:/)).not.toBeInTheDocument();

    const canalInput = screen.getByLabelText("Canal");
    const [firstAlert] = screen.getAllByRole("alert");
    expect(canalInput).toHaveAttribute("aria-describedby", firstAlert.id);
  });

  it("saves a complete entry and lists it", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm tagId="rrss-test" fields={FIELDS} />);

    await user.type(screen.getByLabelText("Canal"), "Instagram");
    await user.type(screen.getByLabelText("Seguidores"), "1200");
    await user.click(screen.getByRole("button", { name: /guardar registro/i }));

    expect(screen.getByText("Instagram")).toBeInTheDocument();
    expect(screen.getByText("1200")).toBeInTheDocument();
  });

  it("can delete a saved entry", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm tagId="rrss-test" fields={FIELDS} />);

    await user.type(screen.getByLabelText("Canal"), "Instagram");
    await user.type(screen.getByLabelText("Seguidores"), "1200");
    await user.click(screen.getByRole("button", { name: /guardar registro/i }));
    expect(screen.getByText("Instagram")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /eliminar registro/i }));

    expect(screen.queryByText("Instagram")).not.toBeInTheDocument();
  });
});
