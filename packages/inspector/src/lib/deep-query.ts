/**
 * Deep query selector — finds elements across shadow DOM boundaries.
 *
 * Standard `document.querySelector()` cannot see into shadow roots.
 * This utility recursively searches all shadow roots to find matching elements.
 */

/**
 * Find the first element matching a CSS selector, searching through all shadow roots.
 * Tries `document.querySelector()` first, then recursively searches shadow roots.
 */
export function deepQuerySelector(selector: string): HTMLElement | null {
  // Fast path: try document-level first
  const direct = document.querySelector<HTMLElement>(selector);
  if (direct) return direct;

  // Recursive search through shadow roots
  return deepSearch(document, selector);
}

/**
 * Find all elements matching a CSS selector, searching through all shadow roots.
 */
export function deepQuerySelectorAll(selector: string): HTMLElement[] {
  const results: HTMLElement[] = [];
  deepSearchAll(document, selector, results);
  return results;
}

/** Recursively search a root and its shadow trees for the first match. */
function deepSearch(
  root: Document | ShadowRoot,
  selector: string,
): HTMLElement | null {
  // Search elements with shadow roots
  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    if (el.shadowRoot) {
      // Try querySelector within this shadow root
      const found = el.shadowRoot.querySelector<HTMLElement>(selector);
      if (found) return found;

      // Recurse into nested shadow roots
      const nested = deepSearch(el.shadowRoot, selector);
      if (nested) return nested;
    }
  }
  return null;
}

/** Recursively search a root and its shadow trees for all matches. */
function deepSearchAll(
  root: Document | ShadowRoot,
  selector: string,
  results: HTMLElement[],
): void {
  for (const el of root.querySelectorAll<HTMLElement>("*")) {
    if (el.shadowRoot) {
      // Collect matches within this shadow root
      const found = el.shadowRoot.querySelectorAll<HTMLElement>(selector);
      for (const f of found) results.push(f);

      // Recurse into nested shadow roots
      deepSearchAll(el.shadowRoot, selector, results);
    }
  }
}
