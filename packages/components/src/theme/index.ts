/**
 * Theme configuration API — bridges DESIGN.md intent to DUI runtime tokens.
 *
 * Usage:
 *   import { applyTheme } from "@dui/components/theme";
 *
 *   applyTheme({
 *     light: { accent: "oklch(0.55 0.25 160)" },
 *     dark:  { accent: "oklch(0.75 0.18 160)" },
 *     fonts: { sans: "Inter", mono: "Geist Mono" },
 *     radius: "0.5rem",
 *   });
 *
 * Call after importing any DUI component. Appends an adopted stylesheet
 * that overrides DUI's defaults in the correct cascade position.
 */

export type ThemePrimitives = {
  background?: string;
  foreground?: string;
  accent?: string;
  destructive?: string;
};

export type ThemeFonts = {
  sans?: string;
  mono?: string;
  serif?: string;
};

export type ThemeConfig = {
  /** Light mode color primitives. */
  light?: ThemePrimitives;
  /** Dark mode color primitives. If omitted, dark mode is derived from light. */
  dark?: ThemePrimitives;
  /** Font family overrides. Values are family names (e.g. "Inter"), not full stacks. */
  fonts?: ThemeFonts;
  /** Base border-radius (e.g. "0.5rem" or "8px"). The full scale is derived from this value. */
  radius?: string;
};

/**
 * Apply a theme configuration to the document.
 *
 * Creates a CSSStyleSheet and appends it to `document.adoptedStyleSheets`
 * after DUI's token sheet, so overrides cascade correctly.
 *
 * Safe to call multiple times — each call replaces the previous theme sheet.
 */
let themeSheet: CSSStyleSheet | null = null;

export function applyTheme(config: ThemeConfig): void {
  const rules: string[] = [];

  // --- Color primitives ---
  const lightVars = buildColorVars(config.light);
  const darkVars = buildColorVars(config.dark ?? deriveDark(config.light));

  if (lightVars) {
    rules.push(`:root:not([data-theme="dark"]) { ${lightVars} }`);
  }
  if (darkVars) {
    rules.push(`:root[data-theme="dark"] { ${darkVars} }`);
  }

  // --- Fonts and radius (theme-independent, go on :root) ---
  const rootVars = buildRootVars(config);
  if (rootVars) {
    rules.push(`:root { ${rootVars} }`);
  }

  const css = rules.join("\n");
  if (!css) return;

  // Replace previous theme sheet if one exists
  if (themeSheet) {
    const idx = document.adoptedStyleSheets.indexOf(themeSheet);
    if (idx !== -1) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
        (s) => s !== themeSheet,
      );
    }
  }

  themeSheet = new CSSStyleSheet();
  themeSheet.replaceSync(css);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, themeSheet];
}

// --- Internals ---

function buildColorVars(primitives?: ThemePrimitives): string {
  if (!primitives) return "";
  const entries: string[] = [];
  if (primitives.background) entries.push(`--background: ${primitives.background};`);
  if (primitives.foreground) entries.push(`--foreground: ${primitives.foreground};`);
  if (primitives.accent) entries.push(`--accent: ${primitives.accent};`);
  if (primitives.destructive) entries.push(`--destructive: ${primitives.destructive};`);
  return entries.join(" ");
}

function buildRootVars(config: ThemeConfig): string {
  const entries: string[] = [];

  // Fonts
  if (config.fonts?.sans) {
    entries.push(
      `--font-sans: '${config.fonts.sans}', system-ui, -apple-system, sans-serif;`,
    );
  }
  if (config.fonts?.mono) {
    entries.push(
      `--font-mono: '${config.fonts.mono}', ui-monospace, SFMono-Regular, monospace;`,
    );
  }
  if (config.fonts?.serif) {
    entries.push(
      `--font-serif: '${config.fonts.serif}', ui-serif, Georgia, serif;`,
    );
  }

  // Radius scale derived from base
  if (config.radius) {
    const base = parseRadiusToRem(config.radius);
    if (base !== null) {
      entries.push(`--radius-xs: ${rem(Math.max(base * 0.25, 0))};`);
      entries.push(`--radius-sm: ${rem(Math.max(base * 0.5, 0))};`);
      entries.push(`--radius-md: ${rem(base)};`);
      entries.push(`--radius-lg: ${rem(base * 2)};`);
      entries.push(`--radius-xl: ${rem(base * 3)};`);
      entries.push(`--radius-2xl: ${rem(base * 4)};`);
    }
  }

  return entries.join(" ");
}

/**
 * Derive dark mode primitives from light mode values.
 *
 * Strategy: parse OKLCH values and adjust lightness.
 * - background: invert L (0.97 → 0.15), add slight chroma from accent hue
 * - foreground: invert L (0.15 → 0.93)
 * - accent: boost L (+0.20), reduce C slightly
 * - destructive: boost L (+0.15), reduce C slightly
 *
 * Falls back to DUI's built-in dark defaults if parsing fails.
 */
function deriveDark(light?: ThemePrimitives): ThemePrimitives | undefined {
  if (!light) return undefined;

  const dark: ThemePrimitives = {};

  if (light.background) {
    const parsed = parseOklch(light.background);
    if (parsed) {
      // Invert: light bg → dark bg. Add a hint of accent hue chroma.
      const accentParsed = light.accent ? parseOklch(light.accent) : null;
      const hue = accentParsed?.h ?? 0;
      dark.background = `oklch(${(1 - parsed.l).toFixed(2)} 0.015 ${hue})`;
    }
  }

  if (light.foreground) {
    const parsed = parseOklch(light.foreground);
    if (parsed) {
      dark.foreground = `oklch(${(1 - parsed.l + 0.08).toFixed(2)} 0 0)`;
    }
  }

  if (light.accent) {
    const parsed = parseOklch(light.accent);
    if (parsed) {
      dark.accent = `oklch(${Math.min(parsed.l + 0.20, 0.90).toFixed(2)} ${Math.max(parsed.c - 0.07, 0.05).toFixed(2)} ${parsed.h})`;
    }
  }

  if (light.destructive) {
    const parsed = parseOklch(light.destructive);
    if (parsed) {
      dark.destructive = `oklch(${Math.min(parsed.l + 0.15, 0.85).toFixed(2)} ${Math.max(parsed.c - 0.04, 0.05).toFixed(2)} ${parsed.h})`;
    }
  }

  return Object.keys(dark).length > 0 ? dark : undefined;
}

/** Parse an oklch(...) string into { l, c, h } numbers. */
function parseOklch(
  value: string,
): { l: number; c: number; h: number } | null {
  const match = value.match(
    /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/,
  );
  if (!match) return null;
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
  };
}

/** Parse a radius value (rem or px) to rem number. */
function parseRadiusToRem(value: string): number | null {
  const remMatch = value.match(/^([\d.]+)\s*rem$/);
  if (remMatch) return parseFloat(remMatch[1]);

  const pxMatch = value.match(/^([\d.]+)\s*px$/);
  if (pxMatch) return parseFloat(pxMatch[1]) / 16;

  return null;
}

/** Format a number as a rem string. */
function rem(value: number): string {
  return value === 0 ? "0" : `${Number(value.toFixed(4))}rem`;
}
