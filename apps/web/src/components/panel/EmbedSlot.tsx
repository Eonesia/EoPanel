import { useState } from "react";
import { Icon } from "../ui/Icon";
import { useLocalStorage } from "../../lib/useLocalStorage";
import { useToast } from "../../lib/toast";

/** Solo http(s): bloquea `javascript:`, `data:`, `vbscript:`, etc. pegados por error o con mala intención. */
export function isEmbeddableUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function EmbedSlot({ tagId, label, description }: { tagId: string; label: string; description: string }) {
  const [url, setUrl] = useLocalStorage<string>(`eopanel-embed-${tagId}`, "");
  const [draft, setDraft] = useState(url);
  const [error, setError] = useState(false);
  const { showToast } = useToast();

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
              showToast(`${label} desconectado`, "info");
            }}
            className="text-xs font-medium text-ink-faint transition-colors hover:text-danger"
          >
            Desconectar
          </button>
        </div>
        <iframe
          src={url}
          title={label}
          className="h-[420px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
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
          const trimmed = draft.trim();
          if (!trimmed) return;
          if (!isEmbeddableUrl(trimmed)) {
            setError(true);
            showToast("Ese enlace no es una URL http(s) válida", "error");
            return;
          }
          setError(false);
          setUrl(trimmed);
          showToast(`${label} conectado`);
        }}
      >
        <input
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Pega el enlace embebible (URL de vista pública)"
          aria-invalid={error}
          aria-describedby={error ? `${tagId}-embed-error` : undefined}
          className={`flex-1 rounded-lg border bg-surface px-3 py-2 text-xs text-ink outline-none transition-colors focus:ring-2 ${
            error
              ? "border-danger focus:border-danger focus:ring-danger/10"
              : "border-border-strong focus:border-brand-400 focus:ring-brand-100"
          }`}
        />
        <button type="submit" className="btn btn-secondary !py-2 !text-xs">
          Conectar
        </button>
      </form>
      {error && (
        <p id={`${tagId}-embed-error`} role="alert" className="text-[11px] font-medium text-danger">
          Debe empezar por http:// o https://
        </p>
      )}
    </div>
  );
}
