import { useNavigate } from "react-router-dom";
import type { Sector } from "../../data/types";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";
import { StatTile } from "../ui/StatTile";
import { useNotifications } from "../../lib/notifications";
import { useFavorites } from "../../lib/favorites";

export function SectorView({ tabId, sector }: { tabId: string; sector: Sector }) {
  const navigate = useNavigate();
  const { tagCount } = useNotifications();
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div>
      <button
        onClick={() => navigate(`/panel/${tabId}`)}
        className="btn btn-ghost mb-4 !px-2.5 !py-1.5 text-ink-soft"
      >
        <Icon name="ti-arrow-left" />
        Volver
      </button>

      <header className="mb-6 flex items-start gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-[20px] text-brand-600">
          <Icon name={sector.icon} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold text-ink md:text-2xl">{sector.label}</h1>
          {sector.description && <p className="mt-0.5 text-sm text-ink-soft">{sector.description}</p>}
        </div>
      </header>

      {sector.widgetStats && sector.widgetStats.length > 0 && (
        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sector.widgetStats.map((s) => (
            <StatTile key={s.label} {...s} />
          ))}
        </div>
      )}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">Accesos directos</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sector.tags.map((tagItem, i) => {
          const favorite = isFavorite(tabId, sector.id, tagItem.id);
          return (
            <div
              key={tagItem.id}
              className="surface-card surface-card-interactive fade-in-up flex items-center gap-1 p-2 pl-4"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <button
                onClick={() => navigate(`/panel/${tabId}/${sector.id}/${tagItem.id}`)}
                className="flex min-w-0 flex-1 items-center gap-3 py-2 text-left"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-[16px] text-brand-600">
                  <Icon name={tagItem.icon} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{tagItem.label}</p>
                  <p className="truncate text-xs text-ink-soft">{tagItem.summary}</p>
                </div>
                <NotificationBadge count={tagCount(tagItem.id)} />
                <Icon name="ti-chevron-right" className="text-ink-faint" />
              </button>
              <button
                onClick={() => toggleFavorite(tabId, sector.id, tagItem.id)}
                className="btn btn-ghost shrink-0 !px-2"
                aria-pressed={favorite}
                aria-label={favorite ? `Quitar ${tagItem.label} de favoritos` : `Añadir ${tagItem.label} a favoritos`}
                title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <Icon name={favorite ? "ti-star-filled" : "ti-star"} className={favorite ? "text-warning" : "text-ink-faint"} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
