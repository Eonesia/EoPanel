import { Navigate, useParams } from "react-router-dom";
import { TABS } from "../data/tabs";
import { AppShell } from "../components/layout/AppShell";
import { TabView } from "../components/panel/TabView";
import { SectorView } from "../components/panel/SectorView";
import { TagDetailView } from "../components/panel/TagDetailView";
import { Icon } from "../components/ui/Icon";
import { useAuth } from "../lib/auth";
import { usePermissions } from "../lib/permissions";

export function PanelPage() {
  const { tabId, sectorId, tagId } = useParams();
  const { profile } = useAuth();
  const { canViewTab, canViewSector } = usePermissions();
  const tab = TABS.find((t) => t.id === tabId);

  if (!tab) return <Navigate to="/panel/global" replace />;

  const sector = sectorId ? tab.sectors.find((s) => s.id === sectorId) : undefined;
  const tag = sector && tagId ? sector.tags.find((t) => t.id === tagId) : undefined;

  const crumbs: { label: string; to?: string }[] = [
    { label: tab.label, to: sector ? `/panel/${tab.id}` : undefined },
  ];
  if (sector) crumbs.push({ label: sector.label, to: tag ? `/panel/${tab.id}/${sector.id}` : undefined });
  if (tag) crumbs.push({ label: tag.label });

  const tabAllowed = canViewTab(profile, tab.id);
  const sectorAllowed = sector ? canViewSector(profile, tab.id, sector.id) : true;

  return (
    <AppShell crumbs={crumbs}>
      {!tabAllowed || !sectorAllowed ? (
        <div className="mx-auto max-w-md">
          <div className="surface-card flex flex-col items-center gap-3 px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-bg text-xl text-ink-faint">
              <Icon name="ti-lock" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ink">Acceso restringido</h2>
              <p className="mt-1.5 text-sm text-ink-soft">
                No tienes permiso para ver esta sección. Pide a un socio que te lo active desde Permisos.
              </p>
            </div>
          </div>
        </div>
      ) : tag && sector ? (
        <TagDetailView tabId={tab.id} sector={sector} tag={tag} />
      ) : sector ? (
        <SectorView tabId={tab.id} sector={sector} />
      ) : (
        <TabView tab={tab} />
      )}
    </AppShell>
  );
}
