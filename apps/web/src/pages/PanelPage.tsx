import { Navigate, useParams } from "react-router-dom";
import { TABS } from "../data/tabs";
import { AppShell } from "../components/layout/AppShell";
import { TabView } from "../components/panel/TabView";
import { SectorView } from "../components/panel/SectorView";
import { TagDetailView } from "../components/panel/TagDetailView";

export function PanelPage() {
  const { tabId, sectorId, tagId } = useParams();
  const tab = TABS.find((t) => t.id === tabId);

  if (!tab) return <Navigate to="/panel/global" replace />;

  const sector = sectorId ? tab.sectors.find((s) => s.id === sectorId) : undefined;
  const tag = sector && tagId ? sector.tags.find((t) => t.id === tagId) : undefined;

  const crumbs: { label: string; to?: string }[] = [
    { label: tab.label, to: sector ? `/panel/${tab.id}` : undefined },
  ];
  if (sector) crumbs.push({ label: sector.label, to: tag ? `/panel/${tab.id}/${sector.id}` : undefined });
  if (tag) crumbs.push({ label: tag.label });

  return (
    <AppShell crumbs={crumbs}>
      {tag && sector ? (
        <TagDetailView tabId={tab.id} sector={sector} tag={tag} />
      ) : sector ? (
        <SectorView tabId={tab.id} sector={sector} />
      ) : (
        <TabView tab={tab} />
      )}
    </AppShell>
  );
}
