import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { TABS } from "../data/tabs";
import { useLocalStorage } from "./useLocalStorage";

export type FavoriteItem = {
  key: string;
  tabId: string;
  tabLabel: string;
  sectorId: string;
  sectorLabel: string;
  tagId: string;
  tagLabel: string;
  tagIcon: string;
};

function keyOf(tabId: string, sectorId: string, tagId: string) {
  return `${tabId}/${sectorId}/${tagId}`;
}

type FavoritesContextValue = {
  isFavorite: (tabId: string, sectorId: string, tagId: string) => boolean;
  toggleFavorite: (tabId: string, sectorId: string, tagId: string) => void;
  listFavorites: () => FavoriteItem[];
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [keys, setKeys] = useLocalStorage<string[]>("eopanel-favorites", []);

  const isFavorite = useCallback(
    (tabId: string, sectorId: string, tagId: string) => keys.includes(keyOf(tabId, sectorId, tagId)),
    [keys],
  );

  const toggleFavorite = useCallback(
    (tabId: string, sectorId: string, tagId: string) => {
      const k = keyOf(tabId, sectorId, tagId);
      setKeys((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
    },
    [setKeys],
  );

  const listFavorites = useCallback((): FavoriteItem[] => {
    const items: FavoriteItem[] = [];
    for (const tab of TABS) {
      for (const sector of tab.sectors) {
        for (const tag of sector.tags) {
          const k = keyOf(tab.id, sector.id, tag.id);
          if (keys.includes(k)) {
            items.push({
              key: k,
              tabId: tab.id,
              tabLabel: tab.label,
              sectorId: sector.id,
              sectorLabel: sector.label,
              tagId: tag.id,
              tagLabel: tag.label,
              tagIcon: tag.icon,
            });
          }
        }
      }
    }
    return items;
  }, [keys]);

  const value = useMemo(
    () => ({ isFavorite, toggleFavorite, listFavorites }),
    [isFavorite, toggleFavorite, listFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
