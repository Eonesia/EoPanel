import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { usePermissions, permissionableTabs } from "../lib/permissions";
import { AppShell } from "../components/layout/AppShell";
import { Icon } from "../components/ui/Icon";
import { Switch } from "../components/ui/Switch";

const ROLES = [
  { id: "empleado" as const, label: "Empleado" },
  { id: "becario" as const, label: "Becario" },
];

export function PermissionsAdminPage() {
  const { profile } = useAuth();
  const { state, setTabEnabled, setSectorEnabled } = usePermissions();

  if (profile?.role !== "socio") {
    return <Navigate to="/panel/global" replace />;
  }

  const tabs = permissionableTabs();

  return (
    <AppShell crumbs={[{ label: "Administración de permisos" }]}>
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="font-display text-xl font-bold text-ink md:text-2xl">Permisos de acceso</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Los 4 socios siempre tienen acceso completo. Configura aquí qué pestañas y sectores puede ver cada rol —
            Vista global está siempre visible para todo el equipo.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="surface-card p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-[16px] text-brand-600">
                  <Icon name={tab.icon} />
                </span>
                <h2 className="font-display text-[15px] font-bold text-ink">{tab.label}</h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {ROLES.map((role) => {
                  const tabPerm = state[role.id]?.[tab.id];
                  const enabled = tabPerm?.enabled ?? false;
                  return (
                    <div key={role.id} className="rounded-xl border border-border bg-surface-2 p-3.5">
                      <div className="mb-2.5 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{role.label}</span>
                        <Switch checked={enabled} onChange={(v) => setTabEnabled(role.id, tab.id, v)} />
                      </div>
                      {enabled && tab.sectors.length > 0 && (
                        <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
                          {tab.sectors.map((sector) => (
                            <Switch
                              key={sector.id}
                              checked={tabPerm?.sectors[sector.id] ?? true}
                              onChange={(v) => setSectorEnabled(role.id, tab.id, sector.id, v)}
                              label={sector.label}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-dashed border-border-strong bg-surface-2 px-4 py-3 text-xs text-ink-faint">
          <Icon name="ti-info-circle" className="mt-0.5 shrink-0" />
          <p>
            Los permisos se guardan localmente en este navegador en esta fase. Al conectar Supabase, este panel
            escribirá directamente en la tabla <code className="rounded bg-surface px-1 py-0.5">tab_permissions</code>{" "}
            (ver <code className="rounded bg-surface px-1 py-0.5">supabase/schema.sql</code>) para que el permiso
            aplique en todos los dispositivos y quede reforzado por RLS en el servidor.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
