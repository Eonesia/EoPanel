import type { TableRow } from "../../data/types";
import { Icon } from "./Icon";

export function DataTable({ columns, rows }: { columns: string[]; rows: TableRow[] }) {
  const scrollHint = columns.length > 3;

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
                <th key={c} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="fade-in-up border-b border-border last:border-0 hover:bg-surface-2/60"
                style={{ animationDelay: `${i * 35}ms` }}
              >
                {columns.map((c) => (
                  <td key={c} className="px-4 py-3 text-ink">
                    {row[c]}
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
