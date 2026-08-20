import { useNavigate } from "react-router-dom";
import type { Sector, Tag } from "../../data/types";
import { Icon } from "../ui/Icon";
import { NotificationBadge } from "../ui/NotificationBadge";
import { StatTile } from "../ui/StatTile";
import { ListRows } from "../ui/ListRows";
import { DataTable } from "../ui/DataTable";
import { EmbedSlot } from "./EmbedSlot";
import { ManualEntryForm } from "./ManualEntryForm";
import { IntegrationStatus } from "./IntegrationStatus";
import { EditableLedger } from "./EditableLedger";
import { EditableTable } from "./EditableTable";
import { useNotifications } from "../../lib/notifications";
import { useToast } from "../../lib/toast";
import { useFavorites } from "../../lib/favorites";

export function TagDetailView({ tabId, sector, tag }: { tabId: string; sector: Sector; tag: Tag }) {
  const navigate = useNavigate();
  const { tagCount, markTagRead } = useNotifications();
  const { showToast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const count = tagCount(tag.id);
  const favorite = isFavorite(tabId, sector.id, tag.id);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(`/panel/${tabId}/${sector.id}`)}
        className="btn btn-ghost mb-4 !px-2.5 !py-1.5 text-ink-soft"
      >
        <Icon name="ti-arrow-left" />
        Volver a {sector.label}
      </button>

      <header className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-[20px] text-brand-600">
            <Icon name={tag.icon} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-ink md:text-2xl">{tag.label}</h1>
              <NotificationBadge count={count} />
            </div>
            <p className="mt-0.5 max-w-lg text-sm text-ink-soft">{tag.detail.intro}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => {
              toggleFavorite(tabId, sector.id, tag.id);
              showToast(favorite ? `${tag.label} quitado de favoritos` : `${tag.label} añadido a favoritos`, "info");
            }}
            className="btn btn-secondary !px-2.5"
            aria-pressed={favorite}
            aria-label={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
          >
            <Icon name={favorite ? "ti-star-filled" : "ti-star"} className={favorite ? "text-warning" : ""} />
          </button>
          {count > 0 && (
            <button
              onClick={() => {
                markTagRead(tag.id);
                showToast(`${tag.label} marcado como leído`);
              }}
              className="btn btn-secondary"
            >
              <Icon name="ti-check" />
              <span className="hidden sm:inline">Marcar como leído</span>
            </button>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {tag.detail.stats && tag.detail.stats.length > 0 && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tag.detail.stats.map((s) => (
              <StatTile key={s.label} {...s} />
            ))}
          </div>
        )}

        {tag.detail.list && tag.detail.list.length > 0 && <ListRows items={tag.detail.list} />}

        {tag.detail.table &&
          (tag.detail.table.editableColumn ? (
            <EditableTable
              tagId={tag.id}
              columns={tag.detail.table.columns}
              seedRows={tag.detail.table.rows}
              editableColumn={tag.detail.table.editableColumn}
            />
          ) : (
            <DataTable columns={tag.detail.table.columns} rows={tag.detail.table.rows} />
          ))}

        {tag.detail.ledger && (
          <EditableLedger
            tagId={tag.id}
            fields={tag.detail.ledger.fields}
            seedRows={tag.detail.ledger.seedRows}
            addLabel={tag.detail.ledger.addLabel}
            totalField={tag.detail.ledger.totalField}
          />
        )}

        {tag.detail.integration && (
          <IntegrationStatus
            provider={tag.detail.integration.provider}
            status={tag.detail.integration.status}
            note={tag.detail.integration.note}
          />
        )}

        {tag.detail.embed && <EmbedSlot tagId={tag.id} label={tag.detail.embed.label} description={tag.detail.embed.description} />}

        {tag.detail.form && <ManualEntryForm tagId={tag.id} fields={tag.detail.form.fields} submitLabel={tag.detail.form.submitLabel} />}

        {!tag.detail.stats &&
          !tag.detail.list &&
          !tag.detail.table &&
          !tag.detail.embed &&
          !tag.detail.form &&
          !tag.detail.ledger &&
          !tag.detail.integration && (
            <div className="surface-card flex flex-col items-center gap-2 px-6 py-12 text-center">
              <Icon name="ti-plug-connected-x" className="text-2xl text-ink-faint" />
              <p className="text-sm text-ink-soft">Esta fuente todavía no está conectada.</p>
            </div>
          )}

        {tag.detail.note && (
          <p className="flex items-start gap-2 rounded-xl border border-dashed border-border-strong bg-surface-2 px-4 py-3 text-xs text-ink-faint">
            <Icon name="ti-info-circle" className="mt-0.5 shrink-0" />
            {tag.detail.note}
          </p>
        )}
      </div>
    </div>
  );
}
