import { useState } from "react";
import type { FormField } from "../../data/types";
import { Icon } from "../ui/Icon";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { useToast } from "../../lib/toast";

type Entry = Record<string, string> & { _at: string };

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
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fields.some((f) => !draft[f.id]?.trim())) return;
    setEntries((prev) => [{ ...draft, _at: new Date().toISOString() } as Entry, ...prev].slice(0, 20));
    setDraft({});
    showToast("Registro guardado");
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
                onChange={(e) => setDraft((d) => ({ ...d, [f.id]: e.target.value }))}
                className="rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
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
          {entries.map((entry, i) => (
            <div key={i} className="fade-in-up flex flex-wrap items-center gap-x-5 gap-y-1 px-4 py-3 text-sm">
              {fields.map((f) => (
                <span key={f.id} className="text-ink-soft">
                  <span className="text-ink-faint">{f.label}: </span>
                  <span className="font-medium text-ink">{entry[f.id]}</span>
                </span>
              ))}
              <span className="ml-auto text-xs text-ink-faint">
                {new Date(entry._at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
