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

export type FormField = {
  id: string;
  label: string;
  type: "text" | "number" | "date" | "url" | "select";
  placeholder?: string;
  /** Requerido cuando type === "select" — limita la entrada a valores válidos (p.ej. los de un CHECK en Supabase). */
  options?: string[];
};

export type TagDetail = {
  intro: string;
  stats?: StatTile[];
  list?: ListItem[];
  table?: { columns: string[]; rows: TableRow[] };
  note?: string;
  /** Slot para contenido embebido (Drive/FTP/Trello/Miro) — el enlace se guarda localmente hasta que exista backend. */
  embed?: { label: string; description: string };
  /** Formulario de entrada manual (p.ej. RRSS sin API todavía) — las entradas se guardan localmente. */
  form?: { fields: FormField[]; submitLabel?: string };
  /** Estado de integración con una fuente externa real (Mail, Banco, LXP…). */
  integration?: { provider: string; status: "conectado" | "pendiente" | "no_conectado"; note: string };
  /**
   * Libro editable (p.ej. Facturación — "Holded propio"): tabla con alta/baja de filas,
   * persistida localmente. `seedRows` es el histórico de ejemplo con el que arranca;
   * `fields` define las columnas editables (mismo id que la columna correspondiente).
   */
  ledger?: {
    fields: FormField[];
    seedRows: TableRow[];
    addLabel?: string;
    /** Id de un campo con importes en formato español ("3.400 €") — si se indica, se muestra la suma en un pie de tabla. */
    totalField?: string;
  };
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
