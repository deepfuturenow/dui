/**
 * Theme applicator — creates themed subclasses of unstyled DUI components
 * and registers them as custom elements.
 *
 * Must be called before any DUI component is used in the DOM.
 */

import type { CSSResult, LitElement } from "lit";

export interface DuiTheme {
  /** Token stylesheet to inject into document.adoptedStyleSheets. */
  tokens: CSSStyleSheet;
  /** Themed :host defaults (font-family, color, line-height). */
  base: CSSResult;
  /** Tag name → component aesthetic styles. */
  styles: Map<string, CSSResult>;
  /** Optional prose stylesheet for .dui-prose rich-text styling. */
  prose?: CSSStyleSheet;
}

/** A DUI component or template class passed to applyTheme. */
export type DuiComponentClass = typeof LitElement & {
  tagName: string;
  /** Optional component classes this element renders internally (auto-registered). */
  dependencies?: DuiComponentClass[];
};

export interface ApplyThemeOptions {
  theme: DuiTheme;
  components: DuiComponentClass[];
}

/**
 * Collect all component classes including their declared dependencies.
 * Dependencies are emitted before the classes that depend on them.
 * Deduplicates by tagName.
 */
function flattenWithDependencies(roots: DuiComponentClass[]): DuiComponentClass[] {
  const seen = new Set<string>();
  const result: DuiComponentClass[] = [];

  function visit(cls: DuiComponentClass): void {
    if (seen.has(cls.tagName)) return;
    seen.add(cls.tagName);
    // Visit dependencies first so they register before this class
    if (cls.dependencies) {
      for (const dep of cls.dependencies) visit(dep);
    }
    result.push(cls);
  }

  for (const cls of roots) visit(cls);
  return result;
}

let activeTheme: DuiTheme | null = null;

export function getActiveTheme(): DuiTheme | null {
  return activeTheme;
}

export function applyTheme({ theme, components }: ApplyThemeOptions): void {
  activeTheme = theme;
  // 1. Inject tokens into document (idempotent)
  if (!document.adoptedStyleSheets.includes(theme.tokens)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, theme.tokens];
  }

  // 1b. Inject prose stylesheet if present (idempotent)
  if (theme.prose && !document.adoptedStyleSheets.includes(theme.prose)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, theme.prose];
  }

  // 2. Flatten dependency tree (breadth-first) so deps register before dependents
  const ordered = flattenWithDependencies(components);

  // 3. For each component, create a themed subclass and register it
  for (const Base of ordered) {
    const tagName = Base.tagName;
    if (customElements.get(tagName)) continue;

    const themeStyles = theme.styles.get(tagName);
    const baseStyles = Array.isArray(Base.styles)
      ? Base.styles
      : Base.styles
        ? [Base.styles]
        : [];

    const composedStyles = [
      ...baseStyles,
      theme.base,
      ...(themeStyles ? [themeStyles] : []),
    ];

    const ThemedClass = class extends Base {
      static override styles = composedStyles;
    };

    customElements.define(tagName, ThemedClass);
  }
}
