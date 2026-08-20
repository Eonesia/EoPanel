import type { TableRow } from "../../data/types";

export function DataTable({ columns, rows }: { columns: string[]; rows: TableRow[] }) {
  return (
    <div className="surface-card overflow-x-auto">
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
            <tr key={i} className="fade-in-up border-b border-border last:border-0 hover:bg-surface-2/60" style={{ animationDelay: `${i * 35}ms` }}>
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
  );
}
