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

describe("EditableLedger select fields", () => {
  const FIELDS_WITH_SELECT: FormField[] = [
    { id: "Nº", label: "Nº", type: "text" },
    { id: "Estado", label: "Estado", type: "select", options: ["Pendiente", "Cobrada", "Anulada"] },
  ];

  it("renders a <select> with only the given options — not a free-text input", async () => {
    const user = userEvent.setup();
    render(<EditableLedger tagId="ledger-select" fields={FIELDS_WITH_SELECT} seedRows={[]} addLabel="Nueva fila" />);

    await user.click(screen.getByRole("button", { name: "Nueva fila" }));

    const select = screen.getByLabelText("Estado");
    expect(select.tagName).toBe("SELECT");
    const options = screen.getAllByRole("option").map((o) => (o as HTMLOptionElement).value);
    expect(options).toEqual(["", "Pendiente", "Cobrada", "Anulada"]);
  });

  it("saves the row with whichever option was picked", async () => {
    const user = userEvent.setup();
    render(<EditableLedger tagId="ledger-select-2" fields={FIELDS_WITH_SELECT} seedRows={[]} addLabel="Nueva fila" />);

    await user.click(screen.getByRole("button", { name: "Nueva fila" }));
    await user.type(screen.getByLabelText("Nº"), "F-100");
    await user.selectOptions(screen.getByLabelText("Estado"), "Cobrada");
    await user.click(screen.getByRole("button", { name: "Guardar" }));

    expect(screen.getByText("Cobrada")).toBeInTheDocument();
  });
});
