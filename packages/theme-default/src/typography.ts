import { unsafeCSS, type CSSResult } from "lit";

/**
 * Single source of truth for the type scale.
 *
 * Each step bundles font-size, letter-spacing, and line-height so
 * they are always set together. Smaller text gets wider tracking for
 * legibility; larger text gets tighter tracking for visual density.
 *
 * The values reference CSS custom properties defined in tokens.css,
 * so consumers can still override individual tokens at :root level.
 */
export const typeScale = {
  "2xs": {
    fontSize: "var(--font-size-2xs)",
    letterSpacing: "var(--letter-spacing-wider)",
    lineHeight: "var(--line-height-normal)",
  },
  "xs": {
    fontSize: "var(--font-size-xs)",
    letterSpacing: "var(--letter-spacing-wide)",
    lineHeight: "var(--line-height-normal)",
  },
  "sm": {
    fontSize: "var(--font-size-sm)",
    letterSpacing: "var(--letter-spacing-wide)",
    lineHeight: "var(--line-height-normal)",
  },
  "base": {
    fontSize: "var(--font-size-base)",
    letterSpacing: "var(--letter-spacing-normal)",
    lineHeight: "var(--line-height-normal)",
  },
  "md": {
    fontSize: "var(--font-size-md)",
    letterSpacing: "var(--letter-spacing-normal)",
    lineHeight: "var(--line-height-normal)",
  },
  "lg": {
    fontSize: "var(--font-size-lg)",
    letterSpacing: "var(--letter-spacing-tight)",
    lineHeight: "var(--line-height-snug)",
  },
  "xl": {
    fontSize: "var(--font-size-xl)",
    letterSpacing: "var(--letter-spacing-tight)",
    lineHeight: "var(--line-height-snug)",
  },
  "2xl": {
    fontSize: "var(--font-size-2xl)",
    letterSpacing: "var(--letter-spacing-tighter)",
    lineHeight: "var(--line-height-tight)",
  },
  "3xl": {
    fontSize: "var(--font-size-3xl)",
    letterSpacing: "var(--letter-spacing-tighter)",
    lineHeight: "var(--line-height-tight)",
  },
  "4xl": {
    fontSize: "var(--font-size-4xl)",
    letterSpacing: "var(--letter-spacing-tightest)",
    lineHeight: "var(--line-height-tight)",
  },
  "5xl": {
    fontSize: "var(--font-size-5xl)",
    letterSpacing: "var(--letter-spacing-tightest)",
    lineHeight: "var(--line-height-none)",
  },
  "6xl": {
    fontSize: "var(--font-size-6xl)",
    letterSpacing: "var(--letter-spacing-tightest)",
    lineHeight: "var(--line-height-none)",
  },
  "7xl": {
    fontSize: "var(--font-size-7xl)",
    letterSpacing: "var(--letter-spacing-tightest)",
    lineHeight: "var(--line-height-none)",
  },
} as const;

export type TypeSize = keyof typeof typeScale;

type TypeOptions = {
  lineHeight?: string;
  letterSpacing?: string;
};

/**
 * Returns CSS declarations for font-size, letter-spacing, and line-height
 * as a bundled type step. Use inside a Lit `css` tagged template.
 *
 * @example
 * ```ts
 * css`:host { ${type("sm")} }`
 *
 * // Expands to:
 * //   font-size: var(--font-size-sm);
 * //   letter-spacing: var(--letter-spacing-wide);
 * //   line-height: var(--line-height-normal);
 * ```
 *
 * @example Override a single property
 * ```ts
 * css`:host { ${type("sm", { lineHeight: "var(--line-height-snug)" })} }`
 * ```
 */
export function type(size: TypeSize, overrides?: TypeOptions): CSSResult {
  const t = typeScale[size];
  const ls = overrides?.letterSpacing ?? t.letterSpacing;
  const lh = overrides?.lineHeight ?? t.lineHeight;
  return unsafeCSS(
    `font-size: ${t.fontSize}; letter-spacing: ${ls}; line-height: ${lh};`,
  );
}
