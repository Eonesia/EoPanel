import { useState } from "react";
import { Icon } from "../ui/Icon";
import { useLocalStorage } from "../../lib/useLocalStorage";

export function EmbedSlot({ tagId, label, description }: { tagId: string; label: string; description: string }) {
  const [url, setUrl] = useLocalStorage<string>(`eopanel-embed-${tagId}`, "");
  const [draft, setDraft] = useState(url);

  if (url) {
    return (
      <div className="surface-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="flex items-center gap-2 text-xs font-medium text-ink-soft">
            <Icon name="ti-plug-connected" className="text-success" />
            {label} conectado
          </span>
          <button
            onClick={() => {
              setUrl("");
              setDraft("");
            }}
            className="text-xs font-medium text-ink-faint transition-colors hover:text-danger"
          >
            Desconectar
          </button>
        </div>
        <iframe src={url} title={label} className="h-[420px] w-full border-0" loading="lazy" />
      </div>
    );
  }

  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-lg text-ink-faint">
        <Icon name="ti-plug-connected-x" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{label} sin conectar</p>
        <p className="mx-auto mt-1 max-w-sm text-xs text-ink-faint">{description}</p>
      </div>
      <form
        className="mt-1 flex w-full max-w-md gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) setUrl(draft.trim());
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Pega el enlace embebible (URL de vista pública)"
          className="flex-1 rounded-lg border border-border-strong bg-surface px-3 py-2 text-xs text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <button type="submit" className="btn btn-secondary !py-2 !text-xs">
          Conectar
        </button>
      </form>
    </div>
  );
}
