import { NavLink } from "react-router-dom";
import { TABS } from "../../data/tabs";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";
import { useNotifications } from "../../lib/notifications";
import { useAuth } from "../../lib/auth";
import { usePermissions } from "../../lib/permissions";
import { useFavorites } from "../../lib/favorites";

export function Sidebar({ className = "" }: { className?: string }) {
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
      {visibleTabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={`/panel/${tab.id}`}
          className={({ isActive }) =>
            [
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-ink text-ink-inverse shadow-[0_8px_20px_-10px_rgba(19,21,42,0.55)]"
                : "text-ink-soft hover:bg-surface-2 hover:text-ink",
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

      {favorites.length > 0 && (
        <>
          <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
            Favoritos
          </p>
          {favorites.map((f) => (
            <NavLink
              key={f.key}
              to={`/panel/${f.tabId}/${f.sectorId}/${f.tagId}`}
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
