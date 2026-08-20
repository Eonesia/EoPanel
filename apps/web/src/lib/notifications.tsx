import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { TABS } from "../data/tabs";

type CountsMap = Record<string, number>;

type NotificationsContextValue = {
  tagCount: (tagId: string) => number;
  sectorCount: (tabId: string, sectorId: string) => number;
  tabCount: (tabId: string) => number;
  markTagRead: (tagId: string) => void;
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
  const [counts, setCounts] = useState<CountsMap>(initialCounts);

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

  const value = useMemo(
    () => ({ tagCount, sectorCount, tabCount, markTagRead }),
    [tagCount, sectorCount, tabCount, markTagRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de <NotificationsProvider>");
  return ctx;
}
