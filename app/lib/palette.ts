/**
 * Single source of truth for literals that cannot read CSS custom properties —
 * Mapbox paint values, marker colours, canvas fills.
 * Keep in sync with the tokens in app/globals.css.
 */
export const PALETTE = {
  background: "#0a0e17",
  card: "#111826",
  gold: "#ffb300",
  orange: "#ff6d00",
  safe: "#00c853",
  danger: "#ff1744",
  warning: "#ff9100",
  info: "#38bdf8",
} as const;

export function hexToRgba(hex: string, alpha: number): string {
  const value = parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
