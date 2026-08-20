import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TABS } from "../../data/tabs";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";
import { useNotifications } from "../../lib/notifications";
import { useAuth } from "../../lib/auth";
import { usePermissions } from "../../lib/permissions";
import { useFavorites } from "../../lib/favorites";
import { useSpring } from "../../lib/useSpring";

type Bounds = { top: number; height: number };

/**
 * The glowing pill that travels between tabs. A separate component so it only
 * mounts once real DOM bounds are known — otherwise useSpring's very first
 * value would be 0 (nothing measured yet) and it would visibly fly in from
 * the top of the list on every page load, before ever reaching the real
 * active tab.
 */
function TabIndicator({ top, height }: Bounds) {
  // Two independent springs for the top and bottom edges, with different
  // stiffness — the leading edge (in the direction of travel) settles
  // faster than the trailing one, so the pill stretches across the gap
  // while moving and then snaps taut, instead of sliding as a rigid block.
  const springTop = useSpring(top, { stiffness: 210, damping: 24 });
  const springBottom = useSpring(top + height, { stiffness: 170, damping: 22 });

  return (
    <div
      aria-hidden="true"
      className="brand-gradient pointer-events-none absolute inset-x-0 rounded-xl shadow-[0_10px_24px_-8px_rgba(91,69,240,0.55),inset_0_1px_0_rgba(255,255,255,0.16)]"
      style={{ top: springTop, height: Math.max(springBottom - springTop, 0) }}
    />
  );
}

function TabList({
  tabs,
  tabCount,
  onNavigate,
}: {
  tabs: typeof TABS;
  tabCount: (tabId: string) => number;
  onNavigate?: () => void;
}) {
  const location = useLocation();
  const listRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<Bounds | null>(null);

  useLayoutEffect(() => {
    const container = listRef.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!container || !active) {
      setBounds(null);
      return;
    }
    const containerTop = container.getBoundingClientRect().top;
    const activeRect = active.getBoundingClientRect();
    setBounds({ top: activeRect.top - containerTop, height: activeRect.height });
    // Re-measure whenever the route changes (new active tab) or the list itself changes shape.
  }, [location.pathname, tabs.length]);

  return (
    <div ref={listRef} className="relative flex flex-col gap-1">
      {bounds && <TabIndicator top={bounds.top} height={bounds.height} />}
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={`/panel/${tab.id}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            [
              "group relative z-10 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150",
              isActive ? "text-ink-inverse" : "text-ink-soft hover:bg-surface-2 hover:text-ink",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                name={tab.icon}
                className={`text-[17px] transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-brand-500"}`}
              />
              <span className="flex-1 truncate">{tab.label}</span>
              {!tab.available && (
                <span className="rounded-full bg-surface-2 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-ink-faint">
                  Pronto
                </span>
              )}
              <NotificationBadge count={tabCount(tab.id)} />
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { tabCount, tagCount } = useNotifications();
  const { profile } = useAuth();
  const { canViewTab, canViewSector } = usePermissions();
  const { listFavorites } = useFavorites();
  const visibleTabs = TABS.filter((tab) => canViewTab(profile, tab.id));
  const favorites = listFavorites().filter(
    (f) => canViewTab(profile, f.tabId) && canViewSector(profile, f.tabId, f.sectorId),
  );

  return (
    <nav className={`flex flex-col gap-1 ${className}`} aria-label="Pestañas del panel">
      <TabList tabs={visibleTabs} tabCount={tabCount} onNavigate={onNavigate} />

      {favorites.length > 0 && (
        <>
          <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Favoritos
          </p>
          {favorites.map((f) => (
            <NavLink
              key={f.key}
              to={`/panel/${f.tabId}/${f.sectorId}/${f.tagId}`}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive ? "bg-ink text-ink-inverse" : "text-ink-soft hover:bg-surface-2 hover:text-ink",
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    name={f.tagIcon}
                    className={`text-[15px] transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-white" : "text-brand-500"}`}
                  />
                  <span className="flex-1 truncate">{f.tagLabel}</span>
                  <NotificationBadge count={tagCount(f.tagId)} />
                </>
              )}
            </NavLink>
          ))}
        </>
      )}

      {profile?.role === "socio" && (
        <>
          <div className="my-2 border-t border-border" />
          <NavLink
            to="/panel/admin/permisos"
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive ? "bg-ink text-ink-inverse" : "text-ink-soft hover:bg-surface-2 hover:text-ink",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon name="ti-shield-lock" className={isActive ? "text-white" : "text-brand-500"} />
                <span className="flex-1 truncate">Permisos</span>
              </>
            )}
          </NavLink>
        </>
      )}
    </nav>
  );
}
