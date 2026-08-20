export type Searchable = {
  label: string;
  breadcrumb: string;
  searchText: string;
};

/**
 * Lower is better. -1 means "no match, exclude". Exact label match beats a
 * label that merely starts with the query, which beats any other substring
 * hit — otherwise a query like "UI" would surface "seg-UI-miento" (a
 * coincidental substring elsewhere) above the actual "UI" item.
 */
export function rankMatch(item: Searchable, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const label = item.label.toLowerCase();
  if (label === q) return 0;
  if (label.startsWith(q)) return 1;
  if (label.includes(q)) return 2;
  if (item.breadcrumb.toLowerCase().includes(q)) return 3;
  if (item.searchText.toLowerCase().includes(q)) return 4;
  return -1;
}

export function searchAndRank<T extends Searchable>(items: T[], query: string, limit = 20): T[] {
  const q = query.trim();
  if (!q) return items.slice(0, limit);
  return items
    .map((item) => ({ item, rank: rankMatch(item, q) }))
    .filter((r) => r.rank >= 0)
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit)
    .map((r) => r.item);
}
