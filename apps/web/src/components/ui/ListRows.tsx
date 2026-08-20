import type { ListItem } from "../../data/types";

const statusStyles: Record<NonNullable<ListItem["status"]>, string> = {
  ok: "bg-success-bg text-success",
  warn: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  neutral: "bg-neutral-bg text-ink-soft",
};

const statusLabel: Record<NonNullable<ListItem["status"]>, string> = {
  ok: "Al día",
  warn: "Atención",
  danger: "Urgente",
  neutral: "Info",
};

export function ListRows({ items }: { items: ListItem[] }) {
  return (
    <ul className="surface-card divide-y divide-border overflow-hidden">
      {items.map((item, i) => (
        <li
          key={i}
          className="fade-in-up flex items-center justify-between gap-4 px-4 py-3.5"
          style={{ animationDelay: `${i * 35}ms` }}
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{item.title}</p>
            {item.meta && <p className="mt-0.5 truncate text-xs text-ink-faint">{item.meta}</p>}
          </div>
          {item.status && (
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[item.status]}`}
            >
              {statusLabel[item.status]}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
