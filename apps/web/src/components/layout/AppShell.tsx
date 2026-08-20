import { useState, type ReactNode } from "react";
import { Icon } from "../ui/Icon";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

type Crumb = { label: string; to?: string };

export function AppShell({ crumbs, children }: { crumbs: Crumb[]; children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/60 px-3 py-5 md:flex">
        <div className="mb-6 flex items-center gap-2.5 px-2">
          <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white shadow-[0_6px_16px_-6px_rgba(91,69,240,0.6)]">
            E
          </span>
          <span className="font-display text-[15px] font-bold text-ink">Panel Eonesia</span>
        </div>
        <Sidebar />
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="fade-in-up absolute left-0 top-0 h-full w-72 bg-surface px-3 py-5 shadow-pop">
            <div className="mb-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-2.5">
                <span className="brand-gradient flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white">
                  E
                </span>
                <span className="font-display text-[15px] font-bold text-ink">Panel Eonesia</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="btn btn-ghost !px-2" aria-label="Cerrar menú">
                <Icon name="ti-x" />
              </button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar crumbs={crumbs} onMenuClick={() => setDrawerOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
