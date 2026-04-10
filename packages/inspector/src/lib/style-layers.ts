/**
 * Style layer analysis — maps adoptedStyleSheets to named layers.
 *
 * applyTheme() composes styles as:
 *   [...Component.styles, theme.base, themeStyles?]
 *
 * For a typical component with base reset + structural styles:
 *   [0] base-reset   — from @dui/core/base
 *   [1] structural   — component's own layout CSS
 *   [2] theme-base   — themed :host defaults (font, color)
 *   [3] theme-component — per-component aesthetic styles
 */

import type { StyleLayerInfo } from "./types.ts";

const LAYER_NAMES = [
  "base-reset",
  "component",
  "theme-base",
  "theme-component",
];

/** Extract CSS property names from a stylesheet's rules. */
function extractProperties(sheet: CSSStyleSheet): string[] {
  const props = new Set<string>();
  try {
    for (const rule of sheet.cssRules) {
      if (rule instanceof CSSStyleRule) {
        for (let i = 0; i < rule.style.length; i++) {
          props.add(rule.style[i]);
        }
      }
    }
  } catch {
    // Cross-origin sheets may throw
  }
  return [...props].sort();
}

/** Map an element's shadow root adopted stylesheets to named layers. */
export function analyzeStyleLayers(el: HTMLElement): StyleLayerInfo[] {
  const root = el.shadowRoot;
  if (!root) return [];

  const sheets = root.adoptedStyleSheets;
  return sheets.map((sheet, i) => ({
    layer: i < LAYER_NAMES.length ? LAYER_NAMES[i] : `layer-${i}`,
    properties: extractProperties(sheet),
  }));
}
