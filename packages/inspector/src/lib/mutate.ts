/**
 * Mutation API — structured write operations over DUI's component/theme vocabulary.
 *
 * Every mutation validates inputs, performs the change, logs to the changelog,
 * and returns a post-mutation inspection so agents can verify the result.
 */

import type { MutationResult, InsertPosition } from "./types.ts";
import { inspectElement } from "./introspect.ts";
import { stableSelector } from "./selector.ts";
import { deepQuerySelector } from "./deep-query.ts";
import { changelog } from "./changelog.ts";

/** Resolve an element from a CSS selector. Returns the element or an error result. */
function resolveElement(selector: string): HTMLElement | MutationResult {
  const el = deepQuerySelector(selector);
  if (!el) {
    return {
      ok: false,
      error: `Element not found: "${selector}"`,
      selector,
      inspection: null as any,
    };
  }
  return el;
}

/** Validate that an element is a dui-* component. */
function validateDuiComponent(el: HTMLElement): string | null {
  if (!el.tagName.toLowerCase().startsWith("dui-")) {
    return `Not a DUI component: <${el.tagName.toLowerCase()}>`;
  }
  if (!el.shadowRoot) {
    return `No shadow root on <${el.tagName.toLowerCase()}>`;
  }
  return null;
}

/** Build a success result with post-mutation inspection. */
function successResult(el: HTMLElement): MutationResult {
  return {
    ok: true,
    selector: stableSelector(el),
    inspection: inspectElement(el),
  };
}

/** Build an error result. */
function errorResult(selector: string, error: string): MutationResult {
  return { ok: false, error, selector, inspection: null as any };
}

/**
 * Set a Lit reactive property on a DUI component.
 * Validates against elementProperties — rejects unknown props.
 */
export function setProp(
  selector: string,
  prop: string,
  value: unknown,
): MutationResult {
  const resolved = resolveElement(selector);
  if (!(resolved instanceof HTMLElement)) return resolved;

  const err = validateDuiComponent(resolved);
  if (err) return errorResult(selector, err);

  const ctor = resolved.constructor as any;
  const elementProps: Map<string, any> | undefined = ctor.elementProperties;

  if (!elementProps || !elementProps.has(prop)) {
    const available = elementProps
      ? [...elementProps.keys()].filter((k) => typeof k === "string").join(", ")
      : "none";
    return errorResult(
      selector,
      `Unknown property "${prop}" on <${resolved.tagName.toLowerCase()}>. Available: ${available}`,
    );
  }

  const oldValue = (resolved as any)[prop];
  (resolved as any)[prop] = value;

  changelog.add("setProp", stableSelector(resolved), { prop, value, oldValue }, () => {
    (resolved as any)[prop] = oldValue;
  });

  return successResult(resolved);
}

/**
 * Set a global CSS custom property on :root.
 * Modifies the document-level theme tokens.
 */
export function setToken(name: string, value: string): MutationResult {
  if (!name.startsWith("--")) {
    return errorResult(":root", `Token name must start with "--": "${name}"`);
  }

  const oldValue = document.documentElement.style.getPropertyValue(name);
  document.documentElement.style.setProperty(name, value);

  changelog.add("setToken", name, { value, oldValue }, () => {
    if (oldValue) {
      document.documentElement.style.setProperty(name, oldValue);
    } else {
      document.documentElement.style.removeProperty(name);
    }
  });

  return {
    ok: true,
    selector: ":root",
    inspection: null as any,
  };
}

/**
 * Set a CSS custom property on a specific element's inline style.
 * For scoped overrides (e.g., changing one button's --button-bg).
 */
export function setComponentToken(
  selector: string,
  name: string,
  value: string,
): MutationResult {
  const resolved = resolveElement(selector);
  if (!(resolved instanceof HTMLElement)) return resolved;

  if (!name.startsWith("--")) {
    return errorResult(selector, `Token name must start with "--": "${name}"`);
  }

  const oldValue = resolved.style.getPropertyValue(name);
  resolved.style.setProperty(name, value);

  changelog.add("setComponentToken", stableSelector(resolved), { name, value, oldValue }, () => {
    if (oldValue) {
      resolved.style.setProperty(name, oldValue);
    } else {
      resolved.style.removeProperty(name);
    }
  });

  return successResult(resolved);
}

/**
 * Replace the light DOM children of a slot.
 * Uses a template element for safe HTML parsing.
 */
export function setSlotContent(
  selector: string,
  slotName: string,
  htmlContent: string,
): MutationResult {
  const resolved = resolveElement(selector);
  if (!(resolved instanceof HTMLElement)) return resolved;

  const err = validateDuiComponent(resolved);
  if (err) return errorResult(selector, err);

  // Save old content for undo
  const isDefault = slotName === "" || slotName === "(default)";
  const oldNodes: Node[] = [];

  if (isDefault) {
    // Default slot: all children without a slot attribute
    for (const child of Array.from(resolved.childNodes)) {
      if (child instanceof HTMLElement && child.getAttribute("slot")) continue;
      oldNodes.push(child.cloneNode(true));
    }
    // Remove old default-slot children
    for (const child of Array.from(resolved.childNodes)) {
      if (child instanceof HTMLElement && child.getAttribute("slot")) continue;
      child.remove();
    }
  } else {
    // Named slot: children with slot="name"
    for (const child of Array.from(resolved.children)) {
      if (child.getAttribute("slot") === slotName) {
        oldNodes.push(child.cloneNode(true));
        child.remove();
      }
    }
  }

  // Parse and insert new content
  const template = document.createElement("template");
  template.innerHTML = htmlContent;
  const newNodes = Array.from(template.content.childNodes);

  if (!isDefault) {
    // Assign slot attribute to top-level elements
    for (const node of newNodes) {
      if (node instanceof HTMLElement) {
        node.setAttribute("slot", slotName);
      }
    }
  }

  resolved.append(...newNodes);

  changelog.add(
    "setSlotContent",
    stableSelector(resolved),
    { slotName, html: htmlContent },
    () => {
      // Undo: remove new, restore old
      if (isDefault) {
        for (const child of Array.from(resolved.childNodes)) {
          if (child instanceof HTMLElement && child.getAttribute("slot")) continue;
          child.remove();
        }
      } else {
        for (const child of Array.from(resolved.children)) {
          if (child.getAttribute("slot") === slotName) child.remove();
        }
      }
      resolved.append(...oldNodes);
    },
  );

  return successResult(resolved);
}

/**
 * Create and insert a new DUI component.
 * Validates that the tag is a registered custom element.
 */
export function insertComponent(
  parentSelector: string,
  position: InsertPosition,
  tag: string,
  props?: Record<string, unknown>,
  slotContent?: string,
): MutationResult {
  const parent = resolveElement(parentSelector);
  if (!(parent instanceof HTMLElement)) return parent;

  // Validate tag is registered
  if (!customElements.get(tag)) {
    return errorResult(
      parentSelector,
      `"${tag}" is not a registered custom element. Did you register it with applyTheme()?`,
    );
  }

  const el = document.createElement(tag);

  // Set properties
  if (props) {
    const ctor = el.constructor as any;
    const elementProps: Map<string, any> | undefined = ctor.elementProperties;
    for (const [key, value] of Object.entries(props)) {
      if (elementProps && !elementProps.has(key)) {
        const available = [...elementProps.keys()]
          .filter((k) => typeof k === "string")
          .join(", ");
        return errorResult(
          parentSelector,
          `Unknown property "${key}" on <${tag}>. Available: ${available}`,
        );
      }
      (el as any)[key] = value;
    }
  }

  // Set slot content
  if (slotContent) {
    el.innerHTML = slotContent;
  }

  // Insert at position
  parent.insertAdjacentElement(position, el);

  const newSelector = stableSelector(el);

  changelog.add(
    "insertComponent",
    newSelector,
    { parentSelector, position, tag, props, slotContent },
    () => {
      el.remove();
    },
  );

  return successResult(el);
}

/**
 * Remove a DUI component from the DOM.
 * Returns the inspection of the parent element post-removal.
 */
export function removeComponent(selector: string): MutationResult {
  const resolved = resolveElement(selector);
  if (!(resolved instanceof HTMLElement)) return resolved;

  const parent = resolved.parentElement;
  const nextSibling = resolved.nextSibling;
  const removedHtml = resolved.outerHTML;

  resolved.remove();

  changelog.add("removeComponent", selector, { removedHtml }, () => {
    // Undo: re-insert the element
    const template = document.createElement("template");
    template.innerHTML = removedHtml;
    const restored = template.content.firstElementChild;
    if (restored && parent) {
      parent.insertBefore(restored, nextSibling);
    }
  });

  if (parent && parent.tagName.toLowerCase().startsWith("dui-")) {
    return successResult(parent);
  }

  return {
    ok: true,
    selector: parent ? stableSelector(parent) : selector,
    inspection: null as any,
  };
}

/**
 * Move a DUI component to a new position in the DOM.
 */
export function moveComponent(
  selector: string,
  newParentSelector: string,
  position: InsertPosition,
): MutationResult {
  const resolved = resolveElement(selector);
  if (!(resolved instanceof HTMLElement)) return resolved;

  const newParent = resolveElement(newParentSelector);
  if (!(newParent instanceof HTMLElement)) return newParent;

  const oldParent = resolved.parentElement;
  const oldNextSibling = resolved.nextSibling;

  newParent.insertAdjacentElement(position, resolved);

  changelog.add(
    "moveComponent",
    stableSelector(resolved),
    { from: selector, to: newParentSelector, position },
    () => {
      // Undo: move back to original position
      if (oldParent) {
        oldParent.insertBefore(resolved, oldNextSibling);
      }
    },
  );

  return successResult(resolved);
}
