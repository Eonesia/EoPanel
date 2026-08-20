import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { TABS } from "../data/tabs";
import { useLocalStorage } from "./useLocalStorage";

type CountsMap = Record<string, number>;

export type UnreadItem = {
  tabId: string;
  tabLabel: string;
  sectorId: string;
  sectorLabel: string;
  tagId: string;
  tagLabel: string;
  tagIcon: string;
  count: number;
};

type NotificationsContextValue = {
  tagCount: (tagId: string) => number;
  sectorCount: (tabId: string, sectorId: string) => number;
  tabCount: (tabId: string) => number;
  markTagRead: (tagId: string) => void;
  listUnread: () => UnreadItem[];
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function initialCounts(): CountsMap {
  const counts: CountsMap = {};
  for (const tab of TABS) {
    for (const sector of tab.sectors) {
      for (const t of sector.tags) {
        counts[t.id] = t.notifications;
      }
    }
  }
  return counts;
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useLocalStorage<CountsMap>("eopanel-notification-counts", initialCounts());

  const tagCount = useCallback((tagId: string) => counts[tagId] ?? 0, [counts]);

  const sectorCount = useCallback(
    (tabId: string, sectorId: string) => {
      const tab = TABS.find((t) => t.id === tabId);
      const sector = tab?.sectors.find((s) => s.id === sectorId);
      if (!sector) return 0;
      return sector.tags.reduce((sum, t) => sum + (counts[t.id] ?? 0), 0);
    },
    [counts],
  );

  const tabCount = useCallback(
    (tabId: string) => {
      const tab = TABS.find((t) => t.id === tabId);
      if (!tab) return 0;
      return tab.sectors.reduce(
        (sum, sector) => sum + sector.tags.reduce((s, t) => s + (counts[t.id] ?? 0), 0),
        0,
      );
    },
    [counts],
  );

  const markTagRead = useCallback((tagId: string) => {
    setCounts((prev) => ({ ...prev, [tagId]: 0 }));
  }, []);

  const listUnread = useCallback((): UnreadItem[] => {
    const items: UnreadItem[] = [];
    for (const tab of TABS) {
      for (const sector of tab.sectors) {
        for (const t of sector.tags) {
          const count = counts[t.id] ?? 0;
          if (count > 0) {
            items.push({
              tabId: tab.id,
              tabLabel: tab.label,
              sectorId: sector.id,
              sectorLabel: sector.label,
              tagId: t.id,
              tagLabel: t.label,
              tagIcon: t.icon,
              count,
            });
          }
        }
      }
    }
    return items.sort((a, b) => b.count - a.count);
  }, [counts]);

  const value = useMemo(
    () => ({ tagCount, sectorCount, tabCount, markTagRead, listUnread }),
    [tagCount, sectorCount, tabCount, markTagRead, listUnread],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de <NotificationsProvider>");
  return ctx;
}
