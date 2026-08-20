import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { useNotifications } from "../../lib/notifications";
import { usePermissions } from "../../lib/permissions";
import { useClickOutside } from "../../lib/useClickOutside";
import { ALL_PROFILES } from "../../data/socios";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";
import { CommandPalette } from "./CommandPalette";

type Crumb = { label: string; to?: string };

export function Topbar({ crumbs, onMenuClick }: { crumbs: Crumb[]; onMenuClick: () => void }) {
  const { profile, isDemo, loginDemo, logout } = useAuth();
  const { listUnread, markTagRead } = useNotifications();
  const { canViewTab, canViewSector } = usePermissions();
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(bellRef, bellOpen, () => setBellOpen(false));
  useClickOutside(profileRef, open, () => setOpen(false));

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const unread = listUnread().filter(
    (item) => canViewTab(profile, item.tabId) && canViewSector(profile, item.tabId, item.sectorId),
  );
  const totalUnread = unread.reduce((sum, item) => sum + item.count, 0);

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
          <span
            key={i}
            className={`items-center gap-1.5 min-w-0 ${i < crumbs.length - 1 ? "hidden sm:flex" : "flex min-w-0 flex-1"}`}
          >
            {i > 0 && <Icon name="ti-chevron-right" className="hidden shrink-0 text-xs text-ink-faint sm:inline" />}
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

      <button
        onClick={() => setPaletteOpen(true)}
        className="btn btn-secondary hidden !gap-2 !text-xs !text-ink-faint sm:inline-flex"
      >
        <Icon name="ti-search" />
        Buscar
        <kbd className="rounded border border-border-strong bg-surface-2 px-1.5 py-0.5 font-sans text-[10px] font-semibold text-ink-faint">
          ⌘K
        </kbd>
      </button>
      <button onClick={() => setPaletteOpen(true)} className="btn btn-ghost !px-2.5 sm:hidden" aria-label="Buscar">
        <Icon name="ti-search" />
      </button>

      <div className="relative shrink-0" ref={bellRef}>
        <button
          onClick={() => {
            setBellOpen((v) => !v);
            setOpen(false);
          }}
          className="btn btn-ghost relative !px-2.5"
          aria-label="Notificaciones"
          aria-haspopup="true"
          aria-expanded={bellOpen}
        >
          <Icon name="ti-bell" className="text-lg" />
          {totalUnread > 0 && (
            <span className="absolute right-0.5 top-0.5">
              <NotificationBadge count={totalUnread} />
            </span>
          )}
        </button>

        {bellOpen && (
          <div
            role="menu"
            aria-label="Notificaciones"
            className="fade-in-up absolute right-0 top-[calc(100%+8px)] w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-pop"
            style={{ boxShadow: "var(--shadow-pop)" }}
          >
            <div className="border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-ink">Notificaciones</p>
              <p className="text-xs text-ink-faint">{totalUnread > 0 ? `${totalUnread} sin leer` : "Todo al día"}</p>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {unread.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-ink-faint">No hay notificaciones pendientes.</p>
              ) : (
                unread.map((item) => (
                  <button
                    key={item.tagId}
                    role="menuitem"
                    onClick={() => {
                      markTagRead(item.tagId);
                      setBellOpen(false);
                      navigate(`/panel/${item.tabId}/${item.sectorId}/${item.tagId}`);
                    }}
                    className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-surface-2"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-[15px] text-brand-600">
                      <Icon name={item.tagIcon} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{item.tagLabel}</p>
                      <p className="truncate text-xs text-ink-faint">
                        {item.tabLabel} · {item.sectorLabel}
                      </p>
                    </div>
                    <NotificationBadge count={item.count} />
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative shrink-0" ref={profileRef}>
        <button
          onClick={() => {
            setOpen((v) => !v);
            setBellOpen(false);
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 transition-all hover:border-brand-100 hover:shadow-[0_4px_14px_-6px_rgba(91,69,240,0.35)]"
          aria-label={`Cuenta de ${profile?.name ?? "usuario"}`}
          aria-haspopup="true"
          aria-expanded={open}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white">
            {profile?.initials}
          </span>
          <span className="hidden text-xs font-medium text-ink-soft sm:inline">{profile?.name}</span>
          <Icon name="ti-chevron-down" className="text-xs text-ink-faint" />
        </button>

        {open && (
          <div
            role="menu"
            aria-label="Menú de cuenta"
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
                {ALL_PROFILES.map((s) => (
                  <button
                    key={s.id}
                    role="menuitem"
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
              role="menuitem"
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

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}
