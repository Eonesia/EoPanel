import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EditableLedger } from "./EditableLedger";
import type { FormField, TableRow } from "../../data/types";

vi.mock("../../lib/toast", async () => {
  const actual = await vi.importActual<typeof import("../../lib/toast")>("../../lib/toast");
  return { ...actual, useToast: () => ({ showToast: vi.fn() }) };
});

const FIELDS: FormField[] = [
  { id: "Nº", label: "Nº", type: "text" },
  { id: "Importe", label: "Importe", type: "text" },
];

const SEED: TableRow[] = [
  { "Nº": "F-001", Importe: "3.400 €" },
  { "Nº": "F-002", Importe: "2.100 €" },
];

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("EditableLedger total footer", () => {
  it("sums the totalField column across seeded rows", () => {
    render(<EditableLedger tagId="ledger-test" fields={FIELDS} seedRows={SEED} totalField="Importe" />);
    expect(screen.getByText("5.500 €")).toBeInTheDocument();
  });

  it("recomputes the total after a row is deleted", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditableLedger tagId="ledger-test-2" fields={FIELDS} seedRows={SEED} totalField="Importe" />,
    );

    const [firstDelete] = screen.getAllByRole("button", { name: "Eliminar fila" });
    await user.click(firstDelete);

    expect(container.querySelector("tfoot")?.textContent).toContain("2.100 €");
    expect(screen.queryByText("5.500 €")).not.toBeInTheDocument();
  });

  it("shows no footer when totalField is not provided", () => {
    render(<EditableLedger tagId="ledger-test-3" fields={FIELDS} seedRows={SEED} />);
    expect(screen.queryByText("5.500 €")).not.toBeInTheDocument();
  });
});
