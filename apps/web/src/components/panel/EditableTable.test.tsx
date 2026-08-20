import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EditableTable } from "./EditableTable";
import type { TableRow } from "../../data/types";

const showToast = vi.fn();
vi.mock("../../lib/toast", async () => {
  const actual = await vi.importActual<typeof import("../../lib/toast")>("../../lib/toast");
  return { ...actual, useToast: () => ({ showToast }) };
});

const COLUMNS = ["Trimestre", "Previsto", "Real (a fecha)"];
const SEED: TableRow[] = [
  { Trimestre: "Q1 2026", Previsto: "58.000 €", "Real (a fecha)": "61.200 €" },
  { Trimestre: "Q2 2026", Previsto: "63.000 €", "Real (a fecha)": "65.400 €" },
];

beforeEach(() => {
  localStorage.clear();
  showToast.mockClear();
});
afterEach(cleanup);

describe("EditableTable", () => {
  it("renders fixed columns as plain text and shows a pencil affordance only on the editable column", () => {
    render(<EditableTable tagId="prevision-test" columns={COLUMNS} seedRows={SEED} editableColumn="Real (a fecha)" />);
    expect(screen.getByText("Q1 2026")).toBeInTheDocument();
    // The fixed "Trimestre"/"Previsto" cells aren't buttons — only the editable column's cells are.
    expect(screen.queryByRole("button", { name: /Q1 2026/ })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /61.200 €/ })).toBeInTheDocument();
  });

  it("edits a value on click, saves on Enter, and persists across remounts", async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <EditableTable tagId="prevision-test-2" columns={COLUMNS} seedRows={SEED} editableColumn="Real (a fecha)" />,
    );

    await user.click(screen.getByRole("button", { name: /61.200 €/ }));
    const input = screen.getByLabelText("Real (a fecha) — fila 1");
    await user.clear(input);
    await user.type(input, "70.000 €{Enter}");

    expect(screen.getByText("70.000 €")).toBeInTheDocument();
    expect(showToast).toHaveBeenCalledWith("Valor actualizado");
    unmount();

    render(<EditableTable tagId="prevision-test-2" columns={COLUMNS} seedRows={SEED} editableColumn="Real (a fecha)" />);
    expect(screen.getByText("70.000 €")).toBeInTheDocument();
    // the untouched row is unaffected
    expect(screen.getByText("65.400 €")).toBeInTheDocument();
  });

  it("saves on blur too, not just Enter", async () => {
    const user = userEvent.setup();
    render(<EditableTable tagId="prevision-test-3" columns={COLUMNS} seedRows={SEED} editableColumn="Real (a fecha)" />);

    await user.click(screen.getByRole("button", { name: /61.200 €/ }));
    const input = screen.getByLabelText("Real (a fecha) — fila 1");
    await user.clear(input);
    await user.type(input, "72.000 €");
    await user.tab(); // moves focus away -> blur

    expect(screen.getByText("72.000 €")).toBeInTheDocument();
  });

  it("cancels the edit on Escape without saving", async () => {
    const user = userEvent.setup();
    render(<EditableTable tagId="prevision-test-4" columns={COLUMNS} seedRows={SEED} editableColumn="Real (a fecha)" />);

    await user.click(screen.getByRole("button", { name: /61.200 €/ }));
    const input = screen.getByLabelText("Real (a fecha) — fila 1");
    await user.clear(input);
    await user.type(input, "999 €{Escape}");

    expect(screen.getByText("61.200 €")).toBeInTheDocument();
    expect(screen.queryByText("999 €")).not.toBeInTheDocument();
  });
});
