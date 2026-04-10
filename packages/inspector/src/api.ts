/**
 * Headless inspector API — exposes window globals for agent use, no UI.
 *
 * Import this entry point when you only need the agent API:
 *   import "@dui/inspector/api";
 *
 * Globals exposed:
 *   window.__dui_inspect(selector?)  — read inspection data
 *   window.__dui_mutate.*            — mutation operations
 *   window.__dui_changelog           — mutation log
 *   window.__dui_export()            — source file changeset
 *   window.__dui_observe(callback)   — subscribe to mutations
 */

import {
  inspectPage,
  inspectElement,
  discoverComponents,
  buildCatalog,
} from "./lib/introspect.ts";
import { deepQuerySelector } from "./lib/deep-query.ts";
import {
  setProp,
  setToken,
  setComponentToken,
  setSlotContent,
  insertComponent,
  removeComponent,
  moveComponent,
} from "./lib/mutate.ts";
import { changelog } from "./lib/changelog.ts";
import { exportChangeset, setSourceMap } from "./lib/source-map.ts";
import type { SourceMapConfig, ChangelogEntry } from "./lib/types.ts";

// --- Read API ---

(window as any).__dui_inspect = (selector?: string) => {
  if (selector) {
    const el = deepQuerySelector(selector);
    if (!el) return { error: `Element not found: "${selector}"` };
    if (!el.shadowRoot) return { error: `No shadow root on: "${selector}"` };
    return inspectElement(el);
  }
  return inspectPage();
};

// --- Write API ---

(window as any).__dui_mutate = {
  setProp,
  setToken,
  setComponentToken,
  setSlotContent,
  insertComponent,
  removeComponent,
  moveComponent,
};

// --- Changelog ---

(window as any).__dui_changelog = {
  entries: () => changelog.entries(),
  undo: () => changelog.undo(),
  clear: () => changelog.clear(),
  count: () => changelog.count,
};

// --- Source map + export ---

(window as any).__dui_export = () => exportChangeset();

// --- Observation API (Phase 5) ---

(window as any).__dui_observe = (callback: (entry: ChangelogEntry) => void) => {
  changelog.subscribe(callback);
  return () => changelog.unsubscribe(callback);
};

// --- Init function for source map configuration ---

export function init(options: { sourceMap?: SourceMapConfig } = {}): void {
  if (options.sourceMap) {
    setSourceMap(options.sourceMap);
  }
}

export {
  inspectPage,
  inspectElement,
  discoverComponents,
  buildCatalog,
  deepQuerySelector,
  setProp,
  setToken,
  setComponentToken,
  setSlotContent,
  insertComponent,
  removeComponent,
  moveComponent,
  changelog,
  exportChangeset,
  setSourceMap,
};
