/**
 * Parsea importes en formato español ("3.400 €", "-450,50 €") a número.
 * "." es separador de miles, "," es separador decimal. Devuelve null si el
 * texto no contiene ningún importe reconocible (para no sumar filas que no
 * son dinero).
 */
export function parseSpanishCurrency(value: string): number | null {
  const match = value.match(/-?[\d.,]*\d/);
  if (!match) return null;
  const normalized = match[0].replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Formatea un número al estilo español ("8.900 €", "1.250,50 €") a mano —
 * `toLocaleString("es-ES")` depende de los datos ICU instalados en el motor
 * JS y en runtimes con ICU reducido (p.ej. Node por defecto) devuelve el
 * número sin separador de miles, silenciosamente.
 */
export function formatSpanishCurrency(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const negative = rounded < 0;
  const abs = Math.abs(rounded);
  const hasDecimals = abs % 1 !== 0;
  const intPart = hasDecimals ? Math.trunc(abs).toString() : Math.round(abs).toString();
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const decimals = hasDecimals ? `,${abs.toFixed(2).split(".")[1]}` : "";
  return `${negative ? "-" : ""}${grouped}${decimals} €`;
}
