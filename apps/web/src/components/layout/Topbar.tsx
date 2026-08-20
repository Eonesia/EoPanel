import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { SOCIOS } from "../../data/socios";
import { Icon } from "../ui/Icon";

type Crumb = { label: string; to?: string };

export function Topbar({ crumbs, onMenuClick }: { crumbs: Crumb[]; onMenuClick: () => void }) {
  const { profile, isDemo, loginDemo, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-md md:px-6">
      <button
        onClick={onMenuClick}
        className="btn btn-ghost !px-2.5 md:hidden"
        aria-label="Abrir menú de navegación"
      >
        <Icon name="ti-menu-2" className="text-lg" />
      </button>

      <nav className="flex min-w-0 flex-1 items-center gap-1.5 text-sm" aria-label="Ruta de navegación">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <Icon name="ti-chevron-right" className="text-xs text-ink-faint" />}
            {c.to ? (
              <button
                onClick={() => navigate(c.to as string)}
                className="truncate rounded-md px-1.5 py-0.5 font-medium text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
              >
                {c.label}
              </button>
            ) : (
              <span className="truncate px-1.5 py-0.5 font-semibold text-ink">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="relative shrink-0">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 transition-all hover:border-brand-100 hover:shadow-[0_4px_14px_-6px_rgba(91,69,240,0.35)]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
            {profile?.initials}
          </span>
          <span className="hidden text-xs font-medium text-ink-soft sm:inline">{profile?.name}</span>
          <Icon name="ti-chevron-down" className="text-xs text-ink-faint" />
        </button>

        {open && (
          <div
            className="fade-in-up absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-pop"
            style={{ boxShadow: "var(--shadow-pop)" }}
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-ink">{profile?.name}</p>
              <p className="text-xs text-ink-faint">{profile?.email}</p>
              {isDemo && (
                <span className="mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                  Modo demo
                </span>
              )}
            </div>

            {isDemo && (
              <div className="border-b border-border p-2">
                <p className="px-2 pb-1 pt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
                  Previsualizar como
                </p>
                {SOCIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      loginDemo(s.id);
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-600">
                      {s.initials}
                    </span>
                    {s.name}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-bg"
            >
              <Icon name="ti-logout-2" />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
