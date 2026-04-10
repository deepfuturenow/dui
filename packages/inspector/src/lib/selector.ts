/**
 * Stable CSS selector generation for DUI components.
 *
 * Components often live deep inside shadow DOM trees (e.g., docs-app shadow root
 * → page component → dui-button). Standard CSS selectors can't cross shadow
 * boundaries, so `document.querySelector()` won't find them.
 *
 * Strategy: stamp each discovered element with a `data-dui-id` attribute
 * containing a unique ID. The selector `[data-dui-id="<id>"]` is then usable
 * with `deepQuerySelector()` which searches across shadow roots.
 *
 * A human-readable path is also generated for display purposes.
 */

let nextId = 1;

/** Generate a stable, unique CSS selector for a DUI element. */
export function stableSelector(el: HTMLElement): string {
  // If already stamped, return existing selector
  const existing = el.getAttribute("data-dui-id");
  if (existing) return `[data-dui-id="${existing}"]`;

  // Stamp with a unique ID
  const id = String(nextId++);
  el.setAttribute("data-dui-id", id);
  return `[data-dui-id="${id}"]`;
}

/**
 * Generate a human-readable path for display (not for querying).
 * Shows the component hierarchy without worrying about shadow DOM boundaries.
 */
export function readablePath(el: HTMLElement): string {
  // Fast path: element has an id
  if (el.id) return `#${el.id}`;

  const segments: string[] = [];
  let current: HTMLElement | null = el;

  while (current && current !== document.body && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase();

    if (current.id) {
      segments.unshift(`#${CSS.escape(current.id)}`);
      break;
    }

    const parentEl: HTMLElement | null = current.parentElement;
    if (parentEl) {
      const siblings = parentEl.querySelectorAll(`:scope > ${tag}`);
      if (siblings.length > 1) {
        const index = Array.from(siblings).indexOf(current) + 1;
        segments.unshift(`${tag}:nth-of-type(${index})`);
      } else {
        segments.unshift(tag);
      }
    } else {
      // Might be at a shadow root boundary — show the host
      const rootNode = current.getRootNode();
      if (rootNode instanceof ShadowRoot && rootNode.host) {
        segments.unshift(tag);
        current = rootNode.host as HTMLElement;
        continue;
      }
      segments.unshift(tag);
    }

    current = parentEl;

    // Stop at a reasonable depth
    if (segments.length > 6) break;
  }

  return segments.join(" > ");
}
