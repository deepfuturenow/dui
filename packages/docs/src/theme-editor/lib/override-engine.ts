/**
 * Override Engine — Inject token overrides into iframe at document level
 *
 * Simplified for dui: tokens live on :root via document.adoptedStyleSheets,
 * so overrides inject a single CSSStyleSheet into the iframe's
 * document.adoptedStyleSheets — no shadow root traversal needed.
 */

import { type TokenTheme } from "./token-parser.ts";

/** Override entry: token name + value + optional theme scope */
export type TokenOverride = {
  name: string;
  value: string;
  theme: TokenTheme;
};

/** Current CSS text (kept in parent context, pushed to iframe sheet on change) */
let currentCssText = "";

/** Sheet living inside the iframe's document context */
let iframeSheet: CSSStyleSheet | undefined;

/** The iframe we're currently connected to */
let connectedIframe: HTMLIFrameElement | undefined;

/**
 * Build CSS text from override entries using :root selectors.
 */
const buildCssText = (overrides: TokenOverride[]): string => {
  const shared: string[] = [];
  const light: string[] = [];
  const dark: string[] = [];

  for (const o of overrides) {
    const decl = `${o.name}: ${o.value} !important;`;
    if (o.theme === "light") light.push(decl);
    else if (o.theme === "dark") dark.push(decl);
    else shared.push(decl);
  }

  let css = "";
  if (shared.length > 0) {
    css += `:root { ${shared.join(" ")} }\n`;
  }
  if (light.length > 0) {
    css += `:root:not([data-theme="dark"]) { ${light.join(" ")} }\n`;
  }
  if (dark.length > 0) {
    css += `:root[data-theme="dark"] { ${dark.join(" ")} }\n`;
  }
  return css;
};

/**
 * Create a new CSSStyleSheet in the iframe's window context and
 * append it to the iframe's document.adoptedStyleSheets.
 */
const bootstrap = (iframe: HTMLIFrameElement): void => {
  const doc = iframe.contentDocument;
  if (!doc) return;

  try {
    const iframeWindow = iframe.contentWindow;
    if (!iframeWindow) return;

    // Must use the iframe's CSSStyleSheet constructor so the sheet
    // belongs to the same document context.
    // deno-lint-ignore no-explicit-any
    const SheetCtor = (iframeWindow as any).CSSStyleSheet as typeof CSSStyleSheet;
    const sheet = new SheetCtor();
    sheet.replaceSync(currentCssText);

    doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
    iframeSheet = sheet;
  } catch {
    // Cross-origin or not ready
  }
};

/**
 * Apply overrides by rebuilding the CSS text and pushing to the iframe sheet.
 */
export const applyOverrides = (overrides: TokenOverride[]): void => {
  currentCssText = buildCssText(overrides);

  if (iframeSheet) {
    try {
      iframeSheet.replaceSync(currentCssText);
    } catch {
      // Sheet may have been invalidated by a page reload — re-bootstrap
      if (connectedIframe) bootstrap(connectedIframe);
    }
  }
};

/**
 * Set up injection for an iframe. Injects now and on every subsequent load.
 */
export const connectIframe = (iframe: HTMLIFrameElement): (() => void) => {
  connectedIframe = iframe;

  const onLoad = (): void => {
    try {
      // Old sheet is gone after navigation — create a new one
      iframeSheet = undefined;
      bootstrap(iframe);
    } catch {
      // Cross-origin or not ready
    }
  };

  iframe.addEventListener("load", onLoad);

  // If already loaded, inject immediately
  if (iframe.contentDocument?.readyState === "complete") {
    onLoad();
  }

  return () => {
    iframe.removeEventListener("load", onLoad);
    connectedIframe = undefined;
    iframeSheet = undefined;
  };
};

/**
 * Clear all overrides.
 */
export const clearOverrides = (): void => {
  currentCssText = "";
  if (iframeSheet) {
    try {
      iframeSheet.replaceSync("");
    } catch {
      // Sheet invalidated
    }
  }
};
