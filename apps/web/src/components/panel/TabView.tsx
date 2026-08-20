import { useNavigate } from "react-router-dom";
import type { Tab } from "../../data/types";
import { SectorCard } from "./SectorCard";
import { Icon } from "../ui/Icon";

export function TabView({ tab }: { tab: Tab }) {
  const navigate = useNavigate();

  if (!tab.available) {
    return (
      <div className="fade-in-up mx-auto max-w-2xl">
        <div className="surface-card flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-pop">
            <Icon name={tab.icon} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">{tab.label}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Esta pestaña ya está reservada en la navegación. Su contenido se construirá en una siguiente fase del
              panel.
            </p>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {tab.sectors.map((s) => (
              <span key={s.id} className="tag-pill !cursor-default">
                <Icon name={s.icon} className="text-[13px]" />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="font-display text-xl font-bold text-ink md:text-2xl">{tab.label}</h1>
        <p className="mt-1 text-sm text-ink-soft">Selecciona un sector para ver su detalle y accesos directos.</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tab.sectors.map((sector, i) => (
          <SectorCard
            key={sector.id}
            tabId={tab.id}
            sector={sector}
            index={i}
            onOpen={() => navigate(`/panel/${tab.id}/${sector.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
