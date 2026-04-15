/** OKLCH triplet. L: 0–1, C: 0–0.4 (typical), H: 0–360. */
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

/**
 * Parse an oklch CSS string like `"oklch(0.55 0.25 260)"` into an Oklch object.
 */
export function parseOklch(str: string): Oklch {
  const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return { l: 0.5, c: 0, h: 0 };
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
}

/**
 * Format an OKLCH triplet as a CSS oklch() string.
 * Matches the style used in tokens.css: `oklch(0.55 0.25 260)`
 */
export function formatOklch({ l, c, h }: Oklch): string {
  const hRound = c < 0.002 ? 0 : Math.round(h);
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${hRound})`;
}
