import { useState } from "react";
import type { TableRow } from "../../data/types";
import { Icon } from "../ui/Icon";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { useToast } from "../../lib/toast";

/**
 * Como DataTable, pero una columna es editable in-situ (p.ej. "Real (a fecha)"
 * en Previsión — la cifra que los socios actualizan cada mes según entra dinero
 * real, sin tocar el resto de la fila). Las filas son fijas (un trimestre, un
 * préstamo…); si hace falta añadir/quitar filas libremente, usar EditableLedger.
 */
export function EditableTable({
  tagId,
  columns,
  seedRows,
  editableColumn,
}: {
  tagId: string;
  columns: string[];
  seedRows: TableRow[];
  editableColumn: string;
}) {
  const [overrides, setOverrides] = useLocalStorage<Record<number, string>>(`eopanel-table-${tagId}`, {});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const { showToast } = useToast();
  const scrollHint = columns.length > 3;

  const rows = seedRows.map((row, i) => (overrides[i] !== undefined ? { ...row, [editableColumn]: overrides[i] } : row));

  function startEdit(index: number, currentValue: string) {
    setEditingIndex(index);
    setDraft(currentValue);
  }

  function saveEdit(index: number) {
    setOverrides((prev) => ({ ...prev, [index]: draft }));
    setEditingIndex(null);
    showToast("Valor actualizado");
  }

  return (
    <div className="surface-card relative overflow-hidden">
      {scrollHint && (
        <div className="flex items-center gap-1.5 border-b border-border bg-surface-2 px-4 py-1.5 text-[11px] font-medium text-ink-faint sm:hidden">
          <Icon name="ti-arrows-horizontal" />
          Desliza para ver todas las columnas
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-2 text-left">
              {columns.map((c) => (
                <th key={c} scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {c}
                  {c === editableColumn && <Icon name="ti-pencil" className="ml-1 text-[10px] text-ink-faint" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="fade-in-up border-b border-border last:border-0 hover:bg-surface-2/60" style={{ animationDelay: `${i * 35}ms` }}>
                {columns.map((c) => (
                  <td key={c} className="px-4 py-3 text-ink">
                    {c !== editableColumn ? (
                      row[c]
                    ) : editingIndex === i ? (
                      <input
                        autoFocus
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => saveEdit(i)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(i);
                          if (e.key === "Escape") setEditingIndex(null);
                        }}
                        aria-label={`${c} — fila ${i + 1}`}
                        className="w-28 rounded-md border border-brand-300 bg-surface px-2 py-1 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-100"
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(i, row[c])}
                        className="group -mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-surface-2"
                      >
                        {row[c]}
                        <Icon name="ti-pencil" className="text-[11px] text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {scrollHint && (
        <div className="pointer-events-none absolute bottom-0 right-0 top-9 w-8 bg-gradient-to-l from-surface to-transparent sm:hidden" />
      )}
    </div>
  );
}
