/**
 * Core introspection engine — discovers and inspects DUI components.
 */

import type {
  ComponentInspection,
  PageInspection,
  PropertyInfo,
  TokenInfo,
  SlotInfo,
  PartInfo,
} from "./types.ts";
import { analyzeStyleLayers } from "./style-layers.ts";

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
  // Match rgb/rgba
  const rgbMatch = value.match(
    /rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/,
  );
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    const hex = `#${[r, g, b].map((c) => Number(c).toString(16).padStart(2, "0")).join("")}`;
    return hex;
  }
  // Already hex
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
    // Skip private/internal
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
    properties: getProperties(el),
    tokens: getTokens(el),
    styleLayers: analyzeStyleLayers(el),
    slots: getSlots(el),
    parts: getParts(el),
    shadowSummary: shadowSummary(el),
  };
}

/** Inspect all DUI components on the page. */
export function inspectPage(): PageInspection {
  const elements = discoverComponents();
  return {
    timestamp: new Date().toISOString(),
    themeMode: document.documentElement.dataset.theme ?? "unknown",
    componentCount: elements.length,
    components: elements.map(inspectElement),
  };
}
