/**
 * OKLCH → sRGB hex conversion.
 *
 * Implements Björn Ottosson's OKLCH → Oklab → LMS → linear-sRGB pipeline
 * with gamut clipping to [0, 1] sRGB range.
 *
 * Reference: https://bottosson.github.io/posts/oklab/
 */

export interface Oklch {
  l: number; // 0–1
  c: number; // 0–~0.4
  h: number; // 0–360
}

/** Parse an oklch CSS string like `"oklch(0.55 0.25 260)"` into an Oklch object. */
export function parseOklch(str: string): Oklch {
  const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
  if (!m) return { l: 0.5, c: 0, h: 0 };
  return { l: parseFloat(m[1]), c: parseFloat(m[2]), h: parseFloat(m[3]) };
}

/** Format an OKLCH triplet as a CSS oklch() string. */
export function formatOklch({ l, c, h }: Oklch): string {
  const hRound = c < 0.002 ? 0 : Math.round(h);
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${hRound})`;
}

/** Convert OKLCH → Oklab (a, b from C, H in degrees). */
function oklchToOklab(l: number, c: number, h: number): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  return [l, c * Math.cos(hRad), c * Math.sin(hRad)];
}

/** Convert Oklab → linear sRGB via LMS intermediate. */
function oklabToLinearSrgb(L: number, a: number, b: number): [number, number, number] {
  // Oklab → LMS (cube-root domain)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  // LMS (cube-root → linear)
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS → linear sRGB
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bOut = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  return [r, g, bOut];
}

/** Apply sRGB gamma (linear → display). */
function linearToSrgb(c: number): number {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** Clamp a number to [0, 1]. */
function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/* ═══════════════════════════════════════════════════════════════════
 * sRGB hex → OKLCH (reverse pipeline)
 * ═══════════════════════════════════════════════════════════════════ */

/** Inverse sRGB gamma (display → linear). */
function srgbToLinear(c: number): number {
  if (c <= 0.04045) return c / 12.92;
  return Math.pow((c + 0.055) / 1.055, 2.4);
}

/** Convert linear sRGB → Oklab via LMS intermediate. */
function linearSrgbToOklab(r: number, g: number, b: number): [number, number, number] {
  // linear sRGB → LMS
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  // LMS → LMS (cube-root domain)
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // LMS (cube-root) → Oklab
  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bOut = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  return [L, a, bOut];
}

/** Convert Oklab → OKLCH (polar form). */
function oklabToOklch(L: number, a: number, b: number): Oklch {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: L, c, h };
}

/**
 * Convert a hex sRGB string (#RGB, #RRGGBB, or #RRGGBBAA) to OKLCH.
 * Alpha channel is ignored.
 */
export function hexToOklch(hex: string): Oklch {
  let h = hex.replace(/^#/, "");

  // Expand shorthand (#RGB → #RRGGBB)
  if (h.length === 3 || h.length === 4) {
    h = h.split("").map((c) => c + c).join("");
  }

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const [lr, lg, lb] = [srgbToLinear(r), srgbToLinear(g), srgbToLinear(b)];
  const [L, a, bLab] = linearSrgbToOklab(lr, lg, lb);
  return oklabToOklch(L, a, bLab);
}

/**
 * Convert an OKLCH color to a hex sRGB string (#RRGGBB).
 * Out-of-gamut colors are clipped to sRGB.
 */
export function oklchToHex(oklch: Oklch): string {
  const [L, a, b] = oklchToOklab(oklch.l, oklch.c, oklch.h);
  const [lr, lg, lb] = oklabToLinearSrgb(L, a, b);

  const r = Math.round(clamp01(linearToSrgb(lr)) * 255);
  const g = Math.round(clamp01(linearToSrgb(lg)) * 255);
  const bVal = Math.round(clamp01(linearToSrgb(lb)) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`;
}

/**
 * Compute a derived token's approximate hex value.
 *
 * Handles the subset of derivation formulas used in DUI's tokens.css:
 * - Lightness offsets: oklch(from base calc(l ± offset) c h)
 * - Alpha reductions: oklch(from base l c h / alpha)
 *   For alpha tokens, composites over the given background color.
 * - Accent/destructive subtle: oklch(from base l c h / 0.10)
 * - Accent text: lightness/chroma scaling
 */
export function computeDerivedHex(
  base: Oklch,
  derivation: { lightnessOffset?: number; alpha?: number; lightnessScale?: number; chromaScale?: number },
  background?: Oklch,
): string {
  let { l, c, h } = base;

  if (derivation.lightnessOffset !== undefined) {
    l = clamp01(l + derivation.lightnessOffset);
  }
  if (derivation.lightnessScale !== undefined) {
    l = clamp01(l * derivation.lightnessScale);
  }
  if (derivation.chromaScale !== undefined) {
    c = c * derivation.chromaScale;
  }

  if (derivation.alpha !== undefined && derivation.alpha < 1) {
    // Composite the semi-transparent color over the background
    const bg = background ?? { l: 0.97, c: 0, h: 0 }; // default light bg
    const [fgL, fgA, fgB] = oklchToOklab(l, c, h);
    const [bgL, bgA, bgB] = oklchToOklab(bg.l, bg.c, bg.h);
    const a = derivation.alpha;

    // Blend in Oklab space (perceptually more accurate)
    const blendedL = fgL * a + bgL * (1 - a);
    const blendedA = fgA * a + bgA * (1 - a);
    const blendedB = fgB * a + bgB * (1 - a);

    const [lr, lg, lb] = oklabToLinearSrgb(blendedL, blendedA, blendedB);
    const r = Math.round(clamp01(linearToSrgb(lr)) * 255);
    const g = Math.round(clamp01(linearToSrgb(lg)) * 255);
    const bVal = Math.round(clamp01(linearToSrgb(lb)) * 255);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`;
  }

  return oklchToHex({ l, c, h });
}
