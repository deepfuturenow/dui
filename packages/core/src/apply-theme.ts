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
}

export interface ApplyThemeOptions {
  theme: DuiTheme;
  components: Array<typeof LitElement & { tagName: string }>;
}

export function applyTheme({ theme, components }: ApplyThemeOptions): void {
  // 1. Inject tokens into document (idempotent)
  if (!document.adoptedStyleSheets.includes(theme.tokens)) {
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, theme.tokens];
  }

  // 2. For each component, create a themed subclass and register it
  for (const Base of components) {
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
