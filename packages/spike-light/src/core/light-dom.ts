/**
 * `lightDom(this)` — the one-line opt-out of shadow DOM for a BUI element.
 *
 * Called from `createRenderRoot()`. It:
 *   1. adopts the class's static stylesheet into the document, once per class
 *      (Lit only adopts static styles into shadow roots; with none, the class
 *      has to do it itself);
 *   2. stamps `data-bui` on the element so the zero-specificity reset in
 *      layer.css applies (spec D2 — measured for the pre-upgrade gap in P1);
 *   3. asserts, in dev, that the layer declaration was installed first —
 *      a component sheet adopted before `layer.css` would create the layers
 *      in the wrong order and the reset would beat the components.
 */
import type { CSSResultGroup, CSSResultOrNative } from "@lit/reactive-element";
import { isLayerInstalled } from "./install.ts";

const adopted = new WeakSet<Function>();

const DEV = true; // Phase 0 is always dev; a real build strips this path.

function flatten(styles: CSSResultGroup | undefined): CSSResultOrNative[] {
  if (!styles) return [];
  if (Array.isArray(styles)) {
    const out: CSSResultOrNative[] = [];
    for (const s of styles) out.push(...flatten(s));
    return out;
  }
  return [styles as CSSResultOrNative];
}

export function lightDom(host: HTMLElement): HTMLElement {
  host.setAttribute("data-bui", "");

  const ctor = host.constructor as Function & { styles?: CSSResultGroup };
  if (!adopted.has(ctor)) {
    adopted.add(ctor);
    if (DEV && !isLayerInstalled()) {
      throw new Error(
        `[bui] ${host.tagName.toLowerCase()}: component stylesheet adopted before ` +
          `layer.css. Import "@dui/spike-light" (core/install.ts) before any component.`,
      );
    }
    for (const style of flatten(ctor.styles)) {
      const sheet = style instanceof CSSStyleSheet
        ? style
        : (style.styleSheet ?? (() => {
          const s = new CSSStyleSheet();
          s.replaceSync(style.cssText);
          return s;
        })());
      if (!document.adoptedStyleSheets.includes(sheet)) {
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      }
    }
  }
  return host;
}
