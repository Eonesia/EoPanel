import { useState } from "react";
import type { FormField } from "../../data/types";
import { Icon } from "../ui/Icon";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { useToast } from "../../lib/toast";

type Entry = Record<string, string> & { _id: string; _at: string };

export function ManualEntryForm({
  tagId,
  fields,
  submitLabel = "Guardar registro",
}: {
  tagId: string;
  fields: FormField[];
  submitLabel?: string;
}) {
  const [entries, setEntries] = useLocalStorage<Entry[]>(`eopanel-form-${tagId}`, []);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const empty = fields.filter((f) => !draft[f.id]?.trim());
    if (empty.length > 0) {
      setMissing(new Set(empty.map((f) => f.id)));
      showToast("Completa todos los campos antes de guardar", "error");
      return;
    }
    setMissing(new Set());
    setEntries((prev) => [{ ...draft, _id: `entry-${Date.now()}`, _at: new Date().toISOString() } as Entry, ...prev].slice(0, 20));
    setDraft({});
    showToast("Registro guardado");
  }

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((entry) => entry._id !== id));
    showToast("Registro eliminado", "info");
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="surface-card flex flex-col gap-3 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Entrada manual</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.id} className="flex flex-col gap-1.5">
              <label htmlFor={`${tagId}-${f.id}`} className="text-xs font-medium text-ink-soft">
                {f.label}
              </label>
              <input
                id={`${tagId}-${f.id}`}
                type={f.type}
                placeholder={f.placeholder}
                value={draft[f.id] ?? ""}
                onChange={(e) => {
                  setDraft((d) => ({ ...d, [f.id]: e.target.value }));
                  if (missing.has(f.id)) setMissing((prev) => new Set([...prev].filter((id) => id !== f.id)));
                }}
                aria-invalid={missing.has(f.id)}
                className={`rounded-lg border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:ring-2 ${
                  missing.has(f.id)
                    ? "border-danger focus:border-danger focus:ring-danger/10"
                    : "border-border-strong focus:border-brand-400 focus:ring-brand-100"
                }`}
              />
            </div>
          ))}
        </div>
        <button type="submit" className="btn btn-primary self-start">
          <Icon name="ti-check" />
          {submitLabel}
        </button>
      </form>

      {entries.length > 0 && (
        <div className="surface-card divide-y divide-border overflow-hidden">
          {entries.map((entry) => (
            <div key={entry._id} className="fade-in-up group flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-3 text-sm">
              {fields.map((f) => (
                <span key={f.id} className="text-ink-soft">
                  <span className="text-ink-faint">{f.label}: </span>
                  <span className="font-medium text-ink">{entry[f.id]}</span>
                </span>
              ))}
              <span className="ml-auto flex items-center gap-3 text-xs text-ink-faint">
                {new Date(entry._at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                <button
                  onClick={() => removeEntry(entry._id)}
                  className="rounded-md p-1 text-ink-faint opacity-0 transition-opacity hover:bg-danger-bg hover:text-danger group-hover:opacity-100"
                  aria-label="Eliminar registro"
                  title="Eliminar registro"
                >
                  <Icon name="ti-trash" />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
