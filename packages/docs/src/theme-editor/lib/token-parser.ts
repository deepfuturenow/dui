/**
 * Token Parser — Extract structured token data from raw CSS text
 *
 * Parses the raw CSS text from tokens.css into structured records
 * for the theme editor UI. Adapted for dui's :root-based selectors.
 */

import { tokensCSS } from "@dui/theme-default/tokens-raw";

export type TokenTheme = "light" | "dark" | undefined;

export type TokenDef = {
  name: string;
  value: string;
  category: string;
  theme: TokenTheme;
  comment?: string;
};

/** Map from category name to its token definitions */
export type TokenRegistry = Map<string, TokenDef[]>;

/**
 * Parse a single CSS custom property declaration.
 * Matches: `--name: value;` with optional inline comment.
 */
const PROP_RE = /^\s*(--[\w-]+)\s*:\s*(.+?)\s*;\s*(?:\/\*\s*(.+?)\s*\*\/)?$/;

/**
 * Parse a CSS text block to extract custom properties.
 */
const parseBlock = (blockContent: string, category: string, theme: TokenTheme): TokenDef[] => {
  const tokens: TokenDef[] = [];
  for (const line of blockContent.split("\n")) {
    const match = line.match(PROP_RE);
    if (match) {
      tokens.push({
        name: match[1],
        value: match[2],
        category,
        theme,
        comment: match[3],
      });
    }
  }
  return tokens;
};

/** Category rules: prefix pattern → category name */
const CATEGORY_RULES: [RegExp, string][] = [
  [/^--space-/, "spacing"],
  [/^--font-/, "typography"],
  [/^--text-/, "typography"],
  [/^--letter-spacing-/, "typography"],
  [/^--line-height-/, "typography"],
  [/^--radius-/, "borders"],
  [/^--border-width-/, "borders"],
  [/^--shadow-/, "elevation"],
  [/^--z-/, "elevation"],
  [/^--duration-/, "motion"],
  [/^--ease-/, "motion"],
  [/^--component-height-/, "sizing"],
  [/^--focus-ring-/, "focus"],
];

/** Derive category from token name prefix. Unmatched tokens go to "colors". */
const categorize = (name: string): string => {
  for (const [pattern, category] of CATEGORY_RULES) {
    if (pattern.test(name)) return category;
  }
  return "colors";
};

/**
 * Build the full token registry by parsing the raw CSS text.
 */
export const buildTokenRegistry = (): TokenRegistry => {
  const registry: TokenRegistry = new Map();

  const addToken = (token: TokenDef): void => {
    const existing = registry.get(token.category) ?? [];
    existing.push(token);
    registry.set(token.category, existing);
  };

  // Parse :root { ... } block (shared tokens + brand colors)
  const rootRe = /^:root\s*\{([\s\S]*?)\}/m;
  const rootMatch = tokensCSS.match(rootRe);
  if (rootMatch) {
    const tokens = parseBlock(rootMatch[1], "", undefined);
    for (const t of tokens) {
      t.category = categorize(t.name);
      addToken(t);
    }
  }

  // Parse :root:not([data-theme="dark"]) { ... } for light theme colors
  const lightRe = /:root:not\(\[data-theme="dark"\]\)\s*\{([\s\S]*?)\}/;
  const lightMatch = tokensCSS.match(lightRe);
  if (lightMatch) {
    const tokens = parseBlock(lightMatch[1], "colors", "light");
    for (const t of tokens) addToken(t);
  }

  // Parse :root[data-theme="dark"] { ... } for dark theme colors
  const darkRe = /:root\[data-theme="dark"\]\s*\{([\s\S]*?)\}/;
  const darkMatch = tokensCSS.match(darkRe);
  if (darkMatch) {
    const tokens = parseBlock(darkMatch[1], "colors", "dark");
    for (const t of tokens) addToken(t);
  }

  return registry;
};

/**
 * Build a composite key that encodes both token name and theme.
 * Used as the key in override maps to distinguish e.g. light vs dark `--background`.
 */
export const overrideKey = (name: string, theme: TokenTheme): string =>
  `${name}::${theme ?? ""}`;

/**
 * Parse a composite override key back into name and theme.
 */
export const parseOverrideKey = (key: string): { name: string; theme: TokenTheme } => {
  const sep = key.lastIndexOf("::");
  const name = key.slice(0, sep);
  const themeStr = key.slice(sep + 2);
  return { name, theme: (themeStr === "light" || themeStr === "dark") ? themeStr : undefined };
};

/**
 * Check if a token value looks like an OKLCH color.
 */
export const isOklchValue = (value: string): boolean =>
  /^oklch\(/.test(value.trim());

/**
 * Parse an OKLCH string into L, C, H, and optional alpha components.
 */
export const parseOklch = (value: string): { l: number; c: number; h: number; alpha?: number } | undefined => {
  const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+))?\s*\)/);
  if (!match) return undefined;
  return {
    l: parseFloat(match[1]),
    c: parseFloat(match[2]),
    h: parseFloat(match[3]),
    alpha: match[4] !== undefined ? parseFloat(match[4]) : undefined,
  };
};

/**
 * Compose an OKLCH string from components.
 */
export const composeOklch = (l: number, c: number, h: number, alpha?: number): string => {
  const lStr = round(l, 4);
  const cStr = round(c, 4);
  const hStr = round(h, 2);
  if (alpha !== undefined && alpha < 1) {
    return `oklch(${lStr} ${cStr} ${hStr} / ${round(alpha, 2)})`;
  }
  return `oklch(${lStr} ${cStr} ${hStr})`;
};

const round = (n: number, decimals: number): string => {
  const factor = 10 ** decimals;
  return String(Math.round(n * factor) / factor);
};
