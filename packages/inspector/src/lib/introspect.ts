/**
 * Core introspection engine — discovers and inspects DUI components.
 */

import type {
  CatalogEntry,
  ComponentInspection,
  EventInfo,
  PageInspection,
  PropertyInfo,
  PropertySchema,
  TokenInfo,
  SlotInfo,
  PartInfo,
} from "./types.ts";
import { analyzeStyleLayers } from "./style-layers.ts";
import { stableSelector, readablePath } from "./selector.ts";

/** Recursively find all `dui-*` elements, traversing into shadow roots. */
export function discoverComponents(): HTMLElement[] {
  const results: HTMLElement[] = [];

  function walk(root: Document | ShadowRoot): void {
    for (const el of root.querySelectorAll<HTMLElement>("*")) {
      if (el.tagName.toLowerCase().startsWith("dui-") && el.shadowRoot) {
        results.push(el);
      }
      if (el.shadowRoot) {
        walk(el.shadowRoot);
      }
    }
  }

  walk(document);
  return results;
}

/** Try to resolve a hex color string from a computed CSS value. */
function tryResolveHex(value: string): string | undefined {
  const rgbMatch = value.match(
    /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/,
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const hex = `#${[r, g, b].map((c) => Number(c).toString(16).padStart(2, "0")).join("")}`;
    return hex;
  }
  if (/^#[0-9a-f]{3,8}$/i.test(value.trim())) {
    return value.trim();
  }
  return undefined;
}

/** Get the first named class in the prototype chain (skips anonymous themed subclass). */
function getClassName(el: HTMLElement): string {
  let proto = Object.getPrototypeOf(el);
  while (proto && proto !== HTMLElement.prototype) {
    if (proto.constructor.name && proto.constructor.name !== "") {
      return proto.constructor.name;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return "Unknown";
}

/** Read Lit's elementProperties to extract property metadata. */
function getProperties(el: HTMLElement): PropertyInfo[] {
  const ctor = el.constructor as any;
  const elementProps: Map<string, any> | undefined = ctor.elementProperties;
  if (!elementProps) return [];

  const result: PropertyInfo[] = [];
  for (const [name, options] of elementProps) {
    if (typeof name === "symbol") continue;

    const value = (el as any)[name];
    const type = options.type?.name ?? typeof value;
    const reflect = options.reflect ?? false;
    const attribute = options.attribute !== undefined
      ? options.attribute
      : (reflect ? name : false);

    result.push({ name, value, type, reflect, attribute });
  }
  return result;
}

/** Scan shadow stylesheets for CSS custom properties and resolve their values. */
function getTokens(el: HTMLElement): TokenInfo[] {
  const root = el.shadowRoot;
  if (!root) return [];

  const tokenNames = new Set<string>();
  for (const sheet of root.adoptedStyleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSStyleRule) {
          const text = rule.cssText;
          const matches = text.matchAll(/var\(\s*(--[\w-]+)/g);
          for (const match of matches) {
            tokenNames.add(match[1]);
          }
        }
      }
    } catch {
      // Cross-origin
    }
  }

  const computed = getComputedStyle(el);
  const tokens: TokenInfo[] = [];

  for (const name of [...tokenNames].sort()) {
    const computedValue = computed.getPropertyValue(name).trim();
    if (!computedValue) continue;

    const token: TokenInfo = {
      name,
      specified: name,
      computed: computedValue,
    };

    const hex = tryResolveHex(computedValue);
    if (hex) token.hex = hex;

    tokens.push(token);
  }

  return tokens;
}

/**
 * Detect events the component dispatches.
 * Scans the prototype's method source for dispatchEvent calls with
 * identifiable event type strings.
 */
function getEvents(el: HTMLElement): EventInfo[] {
  const events: EventInfo[] = [];
  const seen = new Set<string>();

  // 1. Check on* attribute event handlers
  for (const attr of el.attributes) {
    if (attr.name.startsWith("on")) {
      const name = attr.name.slice(2);
      if (!seen.has(name)) {
        seen.add(name);
        events.push({ name, source: "attribute" });
      }
    }
  }

  // 2. Use Chrome DevTools getEventListeners() if available
  const getEventListeners = (window as any).getEventListeners;
  if (typeof getEventListeners === "function") {
    try {
      const listeners = getEventListeners(el) as Record<string, unknown[]>;
      for (const eventName of Object.keys(listeners)) {
        if (!seen.has(eventName)) {
          seen.add(eventName);
          events.push({ name: eventName, source: "addEventListener" });
        }
      }
    } catch {
      // Not in DevTools context
    }
  }

  // 3. Scan prototype methods for dispatchEvent calls to find events the component fires
  let proto = Object.getPrototypeOf(el);
  while (proto && proto !== HTMLElement.prototype) {
    const descriptors = Object.getOwnPropertyDescriptors(proto);
    for (const [, desc] of Object.entries(descriptors)) {
      if (typeof desc.value === "function") {
        const src = desc.value.toString();
        // Match: dispatchEvent(new CustomEvent("event-name" or dispatchEvent(someEvent(
        const matches = src.matchAll(/new\s+CustomEvent\(["']([\w-]+)["']/g);
        for (const m of matches) {
          if (!seen.has(m[1])) {
            seen.add(m[1]);
            events.push({ name: m[1], source: "dispatches" });
          }
        }
      }
    }
    proto = Object.getPrototypeOf(proto);
  }

  return events.sort((a, b) => a.name.localeCompare(b.name));
}

/** Get slot info from the shadow root. */
function getSlots(el: HTMLElement): SlotInfo[] {
  const root = el.shadowRoot;
  if (!root) return [];

  const slots = root.querySelectorAll("slot");
  return Array.from(slots).map((slot) => ({
    name: slot.name || "(default)",
    assignedNodes: slot.assignedNodes({ flatten: true }).length,
  }));
}

/** Get CSS parts from the shadow root. */
function getParts(el: HTMLElement): PartInfo[] {
  const root = el.shadowRoot;
  if (!root) return [];

  const partEls = root.querySelectorAll("[part]");
  const parts: PartInfo[] = [];
  for (const partEl of partEls) {
    const partAttr = partEl.getAttribute("part");
    if (partAttr) {
      for (const name of partAttr.split(/\s+/)) {
        parts.push({ name, tagName: partEl.tagName.toLowerCase() });
      }
    }
  }
  return parts;
}

/** Build a short summary of the shadow DOM structure. */
function shadowSummary(el: HTMLElement): string {
  const root = el.shadowRoot;
  if (!root) return "(no shadow root)";

  const childCount = root.children.length;
  const slotCount = root.querySelectorAll("slot").length;
  const partCount = root.querySelectorAll("[part]").length;
  return `${childCount} children, ${slotCount} slots, ${partCount} parts`;
}

/** Inspect a single DUI element. Returns plain JSON (no DOM refs). */
export function inspectElement(el: HTMLElement): ComponentInspection {
  return {
    tagName: el.tagName.toLowerCase(),
    className: getClassName(el),
    selector: stableSelector(el),
    path: readablePath(el),
    events: getEvents(el),
    properties: getProperties(el),
    tokens: getTokens(el),
    styleLayers: analyzeStyleLayers(el),
    slots: getSlots(el),
    parts: getParts(el),
    shadowSummary: shadowSummary(el),
  };
}

/**
 * Build a catalog of all registered dui-* custom elements.
 * Reads from customElements registry + Lit's elementProperties.
 */
export function buildCatalog(): CatalogEntry[] {
  const catalog: CatalogEntry[] = [];

  // Get all registered custom elements by checking dui-* tags
  // We need to try known tags since there's no way to iterate the registry
  const knownTags = new Set<string>();

  // Discover from DOM instances
  const instances = discoverComponents();
  for (const el of instances) {
    knownTags.add(el.tagName.toLowerCase());
  }

  // Also try to find registered elements by walking customElements
  // The registry doesn't expose iteration, so we rely on discovered instances
  // plus any elements that have been defined but not yet instantiated
  // We can check common dui-* patterns
  const duiPrefixes = [
    "accordion", "accordion-item", "alert-dialog", "alert-dialog-popup",
    "avatar", "badge", "breadcrumb", "breadcrumb-item", "breadcrumb-link",
    "breadcrumb-page", "breadcrumb-separator", "breadcrumb-ellipsis",
    "button", "calendar", "center", "checkbox", "checkbox-group",
    "collapsible", "combobox", "command", "command-input", "command-item",
    "command-list", "command-group", "command-empty", "command-separator",
    "command-shortcut", "data-table", "dialog", "dialog-popup",
    "dropzone", "field", "hstack", "icon", "input", "link",
    "menu", "menu-item", "menubar", "number-field",
    "page-inset", "popover", "popover-popup", "portal",
    "preview-card", "preview-card-popup", "progress",
    "radio", "radio-group", "scroll-area", "select",
    "separator", "sidebar", "sidebar-content", "sidebar-footer",
    "sidebar-group", "sidebar-group-label", "sidebar-header",
    "sidebar-inset", "sidebar-menu", "sidebar-menu-button",
    "sidebar-menu-item", "sidebar-provider", "sidebar-separator",
    "sidebar-trigger", "slider", "spinner", "switch",
    "tab", "tabs", "tabs-indicator", "tabs-list", "tabs-panel",
    "textarea", "toggle", "toggle-group", "toolbar", "tooltip",
    "tooltip-popup", "trunc", "vstack",
  ];

  for (const suffix of duiPrefixes) {
    const tag = `dui-${suffix}`;
    if (customElements.get(tag)) {
      knownTags.add(tag);
    }
  }

  for (const tagName of [...knownTags].sort()) {
    const ctor = customElements.get(tagName) as any;
    if (!ctor) continue;

    const entry: CatalogEntry = {
      tagName,
      properties: [],
      slots: [],
      parts: [],
    };

    // Extract property schemas from Lit's elementProperties
    const elementProps: Map<string, any> | undefined = ctor.elementProperties;
    if (elementProps) {
      for (const [name, options] of elementProps) {
        if (typeof name === "symbol") continue;
        entry.properties.push({
          name,
          type: options.type?.name ?? "unknown",
          default: undefined,
          reflect: options.reflect ?? false,
          attribute: options.attribute !== undefined
            ? options.attribute
            : (options.reflect ? name : false),
        });
      }
    }

    // Try to extract slots and parts from a temporary instance
    try {
      const tempEl = document.createElement(tagName);
      // Append briefly to trigger rendering
      const fragment = document.createDocumentFragment();
      fragment.appendChild(tempEl);

      // Give Lit a microtask to render
      if (tempEl.shadowRoot) {
        const slotEls = tempEl.shadowRoot.querySelectorAll("slot");
        entry.slots = Array.from(slotEls).map((s) => s.name || "(default)");

        const partEls = tempEl.shadowRoot.querySelectorAll("[part]");
        for (const p of partEls) {
          const partAttr = p.getAttribute("part");
          if (partAttr) entry.parts.push(...partAttr.split(/\s+/));
        }
      }
    } catch {
      // Some components may fail to render without context
    }

    catalog.push(entry);
  }

  return catalog;
}

/** Inspect all DUI components on the page. */
export function inspectPage(): PageInspection {
  const elements = discoverComponents();
  return {
    timestamp: new Date().toISOString(),
    themeMode: document.documentElement.dataset.theme ?? "unknown",
    componentCount: elements.length,
    components: elements.map(inspectElement),
    catalog: buildCatalog(),
  };
}
