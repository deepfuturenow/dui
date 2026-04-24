/**
 * Default theme styles for DUI chart component.
 *
 * Uses DUI design tokens for consistency with the rest of the component library.
 * These styles provide aesthetic treatment — the structural CSS lives in the component.
 */
import { css, type CSSResult } from "lit";

const chartThemeStyles = css`
  /* ---------------------------------------------------------------
   * Color palette — 8 colors derived from --accent via hue rotation
   * --------------------------------------------------------------- */
  :host {
    --chart-color-1: var(--accent);
    --chart-color-2: oklch(from var(--accent) l c calc(h + 60));
    --chart-color-3: oklch(from var(--accent) l c calc(h + 120));
    --chart-color-4: oklch(from var(--accent) l c calc(h + 180));
    --chart-color-5: oklch(from var(--accent) l c calc(h + 240));
    --chart-color-6: oklch(from var(--accent) l c calc(h - 60));
    --chart-color-7: oklch(from var(--accent) calc(l + 0.15) calc(c * 0.6) h);
    --chart-color-8: oklch(from var(--accent) calc(l - 0.10) calc(c * 0.8) calc(h + 90));

    --chart-bg: transparent;
    --chart-grid-color: var(--border);
    --chart-axis-color: var(--text-2);
    --chart-font-family: var(--font-sans);
    --chart-font-size: var(--text-xs);
    --chart-line-height: var(--line-height-relaxed);

    /* Tooltip tokens */
    --chart-tooltip-bg: var(--surface-1);
    --chart-tooltip-color: var(--text-1);
    --chart-tooltip-border: var(--border);
    --chart-tooltip-radius: var(--radius-md);
    --chart-tooltip-padding: 8px 12px;
    --chart-tooltip-font-size: var(--chart-font-size);
    --chart-tooltip-line-height: 1.5;
  }

  /* ---------------------------------------------------------------
   * Override Plot's inline defaults
   * CSS rules beat SVG presentation attributes in the cascade
   * --------------------------------------------------------------- */

  /* Plot's root SVG */
  [part="root"] :is(svg, figure) {
    font-family: var(--chart-font-family);
    color: var(--chart-axis-color);
    background: var(--chart-bg);
  }

  /* Override Plot's --plot-background for dark mode */
  [part="root"] svg {
    --plot-background: var(--chart-bg);
  }

  /* Axis text (class selectors added by component, aria-label kept for compat) */
  [part="root"] :is(.chart-x-axis, [aria-label="x-axis"]) text,
  [part="root"] :is(.chart-y-axis, [aria-label="y-axis"]) text {
    fill: var(--chart-axis-color);
    font-size: var(--chart-font-size);
  }

  /* Axis lines and ticks */
  [part="root"] :is(.chart-x-axis, [aria-label="x-axis"]) :is(line, path),
  [part="root"] :is(.chart-y-axis, [aria-label="y-axis"]) :is(line, path) {
    stroke: var(--chart-axis-color);
  }

  /* Grid lines */
  [part="root"] :is([class*="chart-"][class*="-grid"], [aria-label*="grid"]) :is(line, path) {
    stroke: var(--chart-grid-color);
  }

  /* ---------------------------------------------------------------
   * SVG tip — keep --plot-background for Plot internals,
   * but visual styling is handled by the HTML tooltip overlay.
   * --------------------------------------------------------------- */
  [part="root"] :is(.chart-tip, [aria-label="tip"]) {
    --plot-background: var(--surface-1);
  }

  /* ---------------------------------------------------------------
   * HTML tooltip overlay
   * --------------------------------------------------------------- */
  [part="tooltip"] {
    padding: var(--chart-tooltip-padding);
    background: var(--chart-tooltip-bg);
    color: var(--chart-tooltip-color);
    border: 1px solid var(--chart-tooltip-border);
    border-radius: var(--chart-tooltip-radius);
    font-family: var(--chart-font-family);
    font-size: var(--chart-tooltip-font-size);
    line-height: var(--chart-tooltip-line-height);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
    transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1),
                opacity 150ms ease-out;
  }

  [part="tooltip"] .tooltip-row {
    display: flex;
    align-items: baseline;
    gap: 0.35em;
  }

  [part="tooltip"] .tooltip-label {
    font-weight: 600;
  }

  [part="tooltip"] .tooltip-swatch {
    font-size: 0.75em;
    line-height: 1;
  }

  /* Figure title / subtitle / caption */
  [part="root"] figure > h2 {
    font-family: var(--chart-font-family);
    color: var(--text-1);
  }

  [part="root"] figure > h3 {
    font-family: var(--chart-font-family);
    color: var(--text-2);
  }

  [part="root"] figcaption {
    font-family: var(--chart-font-family);
    color: var(--text-3);
    font-size: var(--chart-font-size);
  }

  /* ---------------------------------------------------------------
   * Sparkline variant — minimal, no axes, tight
   * --------------------------------------------------------------- */
  :host([variant="sparkline"]) {
    --chart-bg: transparent;
  }
`;

export { chartThemeStyles };

/** @deprecated Tag name → themed CSS map. Use direct imports instead. */
export const chartStyles: Map<string, CSSResult> = new Map([
  ["dui-chart", chartThemeStyles],
]);
