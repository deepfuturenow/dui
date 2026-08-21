/**
 * Side-effect install: adopts DUI's token sheet (BUI consumes the same token
 * vocabulary — spec D1 copies it; Phase 0 imports it, since this spike lives
 * inside the dui workspace) and the BUI layer declaration + reset.
 *
 * Order matters: `layer.css` fixes the layer order, so it must be adopted
 * before any component stylesheet. `lightDom()` asserts this happened.
 */
import { tokenSheet } from "@dui/components/tokens";
import layerCss from "./layer.css" with { type: "text" };

export const layerSheet = new CSSStyleSheet();
layerSheet.replaceSync(layerCss);

for (const sheet of [tokenSheet, layerSheet]) {
  if (!document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
  }
}

export function isLayerInstalled(): boolean {
  return document.adoptedStyleSheets.includes(layerSheet);
}
