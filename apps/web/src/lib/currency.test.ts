import { describe, expect, it } from "vitest";
import { formatSpanishCurrency, parseSpanishCurrency } from "./currency";

describe("parseSpanishCurrency", () => {
  it("parses thousands-separated amounts with a currency symbol", () => {
    expect(parseSpanishCurrency("3.400 €")).toBe(3400);
    expect(parseSpanishCurrency("9.200 €")).toBe(9200);
  });

  it("parses decimals using a comma", () => {
    expect(parseSpanishCurrency("1.250,50 €")).toBe(1250.5);
  });

  it("parses negative amounts", () => {
    expect(parseSpanishCurrency("-450 €")).toBe(-450);
  });

  it("returns null for text with no recognizable amount", () => {
    expect(parseSpanishCurrency("Pendiente")).toBeNull();
    expect(parseSpanishCurrency("")).toBeNull();
  });
});

describe("formatSpanishCurrency", () => {
  it("formats a number back into Spanish thousands-separated euros", () => {
    expect(formatSpanishCurrency(8900)).toBe("8.900 €");
  });

  it("formats decimals with a comma, keeping the thousands separator", () => {
    expect(formatSpanishCurrency(1250.5)).toBe("1.250,50 €");
  });

  it("formats negative amounts with a leading minus", () => {
    expect(formatSpanishCurrency(-450)).toBe("-450 €");
  });

  it("round-trips parse -> format for the seeded invoice amounts", () => {
    expect(formatSpanishCurrency(parseSpanishCurrency("3.400 €")!)).toBe("3.400 €");
    expect(formatSpanishCurrency(parseSpanishCurrency("9.200 €")!)).toBe("9.200 €");
  });
});
