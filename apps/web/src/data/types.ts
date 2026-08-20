export type StatTile = {
  label: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down" | "flat";
};

export type ListItem = {
  title: string;
  meta?: string;
  status?: "ok" | "warn" | "danger" | "neutral";
};

export type TableRow = Record<string, string>;

export type TagDetail = {
  intro: string;
  stats?: StatTile[];
  list?: ListItem[];
  table?: { columns: string[]; rows: TableRow[] };
  note?: string;
};

export type Tag = {
  id: string;
  label: string;
  icon: string;
  notifications: number;
  summary: string;
  detail: TagDetail;
};

export type Sector = {
  id: string;
  label: string;
  icon: string;
  description: string;
  widgetStats?: StatTile[];
  tags: Tag[];
};

export type Tab = {
  id: string;
  label: string;
  icon: string;
  available: boolean;
  sectors: Sector[];
};
