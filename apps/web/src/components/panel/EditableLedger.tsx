import { useMemo, useState } from "react";
import type { FormField, TableRow } from "../../data/types";
import { Icon } from "../ui/Icon";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { useToast } from "../../lib/toast";
import { formatSpanishCurrency, parseSpanishCurrency } from "../../lib/currency";

type Row = TableRow & { _id: string };

export function EditableLedger({
  tagId,
  fields,
  seedRows,
  addLabel = "Añadir fila",
  totalField,
}: {
  tagId: string;
  fields: FormField[];
  seedRows: TableRow[];
  addLabel?: string;
  totalField?: string;
}) {
  const seeded: Row[] = seedRows.map((r, i) => ({ ...r, _id: `seed-${i}` }));
  const [rows, setRows] = useLocalStorage<Row[]>(`eopanel-ledger-${tagId}`, seeded);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [formOpen, setFormOpen] = useState(false);
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fields.some((f) => !draft[f.id]?.trim())) return;
    setRows((prev) => [{ ...draft, _id: `row-${Date.now()}` } as Row, ...prev]);
    setDraft({});
    setFormOpen(false);
    showToast("Fila añadida al libro");
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r._id !== id));
    showToast("Fila eliminada", "info");
  }

  const total = useMemo(() => {
    if (!totalField) return null;
    return rows.reduce((sum, row) => sum + (parseSpanishCurrency(row[totalField] ?? "") ?? 0), 0);
  }, [rows, totalField]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
          {rows.length} {rows.length === 1 ? "registro" : "registros"}
        </p>
        <button onClick={() => setFormOpen((v) => !v)} className="btn btn-secondary !text-xs">
          <Icon name={formOpen ? "ti-x" : "ti-plus"} />
          {formOpen ? "Cancelar" : addLabel}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="surface-card fade-in-up grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <label htmlFor={`${tagId}-ledger-${f.id}`} className="text-xs font-medium text-ink-soft">
                {f.label}
              </label>
              <input
                id={`${tagId}-ledger-${f.id}`}
                type={f.type}
                placeholder={f.placeholder}
                value={draft[f.id] ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, [f.id]: e.target.value }))}
                className="rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          ))}
          <button type="submit" className="btn btn-primary self-start sm:col-span-2">
            <Icon name="ti-check" />
            Guardar
          </button>
        </form>
      )}

      <div className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-2 text-left">
                {fields.map((f) => (
                  <th key={f.id} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                    {f.label}
                  </th>
                ))}
                <th className="w-10 px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row._id}
                  className="fade-in-up group border-b border-border last:border-0 hover:bg-surface-2/60"
                  style={{ animationDelay: `${i * 25}ms` }}
                >
                  {fields.map((f) => (
                    <td key={f.id} className="px-4 py-3 text-ink">
                      {row[f.id]}
                    </td>
                  ))}
                  <td className="px-2 py-3 text-right">
                    <button
                      onClick={() => removeRow(row._id)}
                      className="rounded-md p-1 text-ink-faint opacity-0 transition-opacity hover:bg-danger-bg hover:text-danger group-hover:opacity-100"
                      aria-label="Eliminar fila"
                      title="Eliminar fila"
                    >
                      <Icon name="ti-trash" />
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={fields.length + 1} className="px-4 py-8 text-center text-sm text-ink-faint">
                    Sin registros todavía.
                  </td>
                </tr>
              )}
            </tbody>
            {total !== null && rows.length > 0 && (
              <tfoot>
                <tr className="border-t border-border-strong bg-surface-2">
                  {fields.map((f) => (
                    <td key={f.id} className="px-4 py-2.5 text-sm font-semibold text-ink">
                      {f.id === totalField ? formatSpanishCurrency(total) : f.id === fields[0].id ? "Total" : ""}
                    </td>
                  ))}
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
