import type { Sector } from "../../data/types";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";
import { useNotifications } from "../../lib/notifications";

export function SectorCard({
  tabId,
  sector,
  onOpen,
  index,
}: {
  tabId: string;
  sector: Sector;
  onOpen: () => void;
  index: number;
}) {
  const { sectorCount } = useNotifications();
  const count = sectorCount(tabId, sector.id);

  return (
    <button
      onClick={onOpen}
      className="surface-card surface-card-interactive fade-in-up flex flex-col gap-3 p-5 text-left"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-[19px] text-brand-600">
          <Icon name={sector.icon} />
        </span>
        <NotificationBadge count={count} />
      </div>
      <div>
        <h3 className="font-display text-[15px] font-bold text-ink">{sector.label}</h3>
        {sector.description && <p className="mt-1 text-[13px] leading-snug text-ink-soft">{sector.description}</p>}
      </div>
      {sector.tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {sector.tags.slice(0, 4).map((t) => (
            <span key={t.id} className="tag-pill !cursor-default">
              {t.label}
            </span>
          ))}
          {sector.tags.length > 4 && <span className="tag-pill !cursor-default">+{sector.tags.length - 4}</span>}
        </div>
      )}
    </button>
  );
}
