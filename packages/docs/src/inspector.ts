/**
 * DUI Inspector — entry point.
 *
 * Mounts the inspector overlay and exposes `window.__dui_inspect` for LLM agents.
 */

import "./inspector/views/inspector-view.ts";
import {
  inspectPage,
  inspectElement,
  discoverComponents,
} from "./inspector/lib/introspect.ts";

// Mount inspector overlay
const inspector = document.createElement("inspector-view");
document.body.appendChild(inspector);

// Global API for LLM agents via Chrome DevTools MCP
(window as any).__dui_inspect = (selector?: string) => {
  if (selector) {
    const el = document.querySelector(selector);
    if (!el?.shadowRoot) return { error: `No DUI component: "${selector}"` };
    return inspectElement(el as HTMLElement);
  }
  return inspectPage();
};

export { inspectPage, inspectElement, discoverComponents };
