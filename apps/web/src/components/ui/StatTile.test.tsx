import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatTile } from "./StatTile";

describe("StatTile trend badge", () => {
  it("shows the icon-only badge when trendDirection is set without trend text", () => {
    // Regression: 15 stats across the data files set trendDirection alone
    // (e.g. "Churn mensual", trendDirection: "down") with no accompanying
    // trend string — the badge used to be gated on `trend` alone and never
    // rendered for any of them.
    const { container } = render(<StatTile label="Churn mensual" value="1,8%" trendDirection="down" />);
    expect(container.querySelector(".tabler-icon-trending-down")).toBeInTheDocument();
  });

  it("shows both the icon and the delta text when both are provided", () => {
    render(<StatTile label="MRR" value="14.900 €" trend="+6%" trendDirection="up" />);
    expect(screen.getByText("+6%")).toBeInTheDocument();
  });

  it("shows no badge at all when neither trend nor trendDirection is set", () => {
    const { container } = render(<StatTile label="Productos activos" value="4" />);
    expect(container.querySelector('[class*="rounded-full"]')).not.toBeInTheDocument();
  });

  it("defaults to a flat/neutral icon when trend text is given without a direction", () => {
    const { container } = render(<StatTile label="Algo" value="1" trend="sin cambios" />);
    expect(container.querySelector(".tabler-icon-minus")).toBeInTheDocument();
  });
});
