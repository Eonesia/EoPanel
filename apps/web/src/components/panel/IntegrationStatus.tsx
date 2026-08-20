import { Icon } from "../ui/Icon";

const styles = {
  conectado: { icon: "ti-plug-connected", cls: "bg-success-bg text-success", label: "Conectado" },
  pendiente: { icon: "ti-refresh", cls: "bg-warning-bg text-warning", label: "Pendiente de configurar" },
  no_conectado: { icon: "ti-plug-connected-x", cls: "bg-neutral-bg text-ink-faint", label: "No conectado" },
} as const;

export function IntegrationStatus({
  provider,
  status,
  note,
}: {
  provider: string;
  status: keyof typeof styles;
  note: string;
}) {
  const s = styles[status];
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[15px] ${s.cls}`}>
        <Icon name={s.icon} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">
          {provider} <span className={`ml-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.cls}`}>{s.label}</span>
        </p>
        <p className="mt-0.5 text-xs text-ink-faint">{note}</p>
      </div>
    </div>
  );
}
