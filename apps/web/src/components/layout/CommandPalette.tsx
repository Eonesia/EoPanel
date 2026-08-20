import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TABS } from "../../data/tabs";
import { useAuth } from "../../lib/auth";
import { usePermissions } from "../../lib/permissions";
import { useNotifications } from "../../lib/notifications";
import { searchAndRank } from "../../lib/search";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";

type PaletteItem = {
  id: string;
  label: string;
  breadcrumb: string;
  icon: string;
  path: string;
  searchText: string;
  notifications: number;
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { canViewTab, canViewSector } = usePermissions();
  const { tagCount } = useNotifications();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<PaletteItem[]>(() => {
    const list: PaletteItem[] = [];
    for (const tab of TABS) {
      if (!canViewTab(profile, tab.id)) continue;
      list.push({
        id: `tab-${tab.id}`,
        label: tab.label,
        breadcrumb: "Pestaña",
        icon: tab.icon,
        path: `/panel/${tab.id}`,
        searchText: tab.label,
        notifications: 0,
      });
      for (const sector of tab.sectors) {
        if (!canViewSector(profile, tab.id, sector.id)) continue;
        list.push({
          id: `sector-${tab.id}-${sector.id}`,
          label: sector.label,
          breadcrumb: tab.label,
          icon: sector.icon,
          path: `/panel/${tab.id}/${sector.id}`,
          searchText: `${sector.label} ${tab.label}`,
          notifications: 0,
        });
        for (const tag of sector.tags) {
          list.push({
            id: `tag-${tab.id}-${sector.id}-${tag.id}`,
            label: tag.label,
            breadcrumb: `${tab.label} · ${sector.label}`,
            icon: tag.icon,
            path: `/panel/${tab.id}/${sector.id}/${tag.id}`,
            searchText: `${tag.label} ${sector.label} ${tab.label} ${tag.summary}`,
            notifications: tagCount(tag.id),
          });
        }
      }
    }
    if (profile?.role === "socio") {
      list.push({
        id: "admin-permisos",
        label: "Permisos",
        breadcrumb: "Administración",
        icon: "ti-shield-lock",
        path: "/panel/admin/permisos",
        searchText: "permisos administración accesos roles",
        notifications: 0,
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, canViewTab, canViewSector]);

  const results = useMemo(() => searchAndRank(items, query, query ? 20 : 8), [items, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  function go(item: PaletteItem) {
    navigate(item.path);
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) go(item);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]">
      <div className="fade-in-up absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en el panel"
        className="fade-in-up relative w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-pop"
        style={{ boxShadow: "var(--shadow-pop)" }}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Icon name="ti-search" className="text-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ir a una pestaña, sector o tag…"
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <kbd className="rounded border border-border-strong bg-surface-2 px-1.5 py-0.5 text-[10px] font-semibold text-ink-faint">
            Esc
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-ink-faint">Sin resultados para "{query}".</p>
          ) : (
            results.map((item, i) => (
              <button
                key={item.id}
                onClick={() => go(item)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  i === activeIndex ? "bg-brand-50" : "hover:bg-surface-2"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[15px] ${
                    i === activeIndex ? "bg-white text-brand-600" : "bg-surface-2 text-ink-faint"
                  }`}
                >
                  <Icon name={item.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{item.label}</p>
                  <p className="truncate text-xs text-ink-faint">{item.breadcrumb}</p>
                </div>
                <NotificationBadge count={item.notifications} />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
