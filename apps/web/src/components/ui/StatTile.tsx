import type { StatTile as StatTileType } from "../../data/types";
import { Icon } from "./Icon";

const trendStyles: Record<NonNullable<StatTileType["trendDirection"]>, string> = {
  up: "text-success bg-success-bg",
  down: "text-danger bg-danger-bg",
  flat: "text-ink-faint bg-neutral-bg",
};

const trendIcon: Record<NonNullable<StatTileType["trendDirection"]>, string> = {
  up: "ti-trending-up",
  down: "ti-trending-down",
  flat: "ti-minus",
};

export function StatTile({ label, value, trend, trendDirection = "flat" }: StatTileType) {
  return (
    <div className="surface-card fade-in-up flex flex-col gap-2 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <span className="font-display text-2xl font-bold text-ink">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${trendStyles[trendDirection]}`}
          >
            <Icon name={trendIcon[trendDirection]} />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
