import { css } from "lit";

export const buttonStyles = css`
  /* ---------------------------------------------------------------
   * Variables: only what variants and sizes actually toggle.
   * Everything else — filters, transforms, clip-paths, shadows,
   * text-decoration — consumers style via ::part(root).
   * --------------------------------------------------------------- */
  :host {
    --button-bg: var(--primary);
    --button-fg: var(--primary-foreground);
    --button-border: transparent;
    --button-hover-bg: color-mix(in oklch, var(--button-bg) 95%, var(--foreground));
    --button-active-bg: color-mix(in oklch, var(--button-bg) 90%, var(--foreground));
    --button-height: var(--component-height-md);
    --button-width: auto;
    --button-padding-y: var(--space-2);
    --button-padding-x: var(--space-2_5);
    --button-gap: var(--space-1_5);
    --button-radius: var(--radius-md);
    --button-font-size: var(--font-size-sm);
    --button-icon-size: var(--space-4_5);
  }

  /* --- Variants (swap colors) --- */

  :host([variant="secondary"]) {
    --button-bg: var(--secondary);
    --button-fg: var(--secondary-foreground);
    --button-border: transparent;
  }

  :host([variant="destructive"]) {
    --button-bg: var(--destructive);
    --button-fg: var(--destructive-foreground);
    --button-border: transparent;
  }

  :host([variant="outline"]) {
    --button-fg: var(--foreground);
    --button-border: var(--input);
    --button-bg: var(--input-bg);
    --button-hover-bg: var(--muted);
    --button-active-bg: var(--muted);
  }

  :host([variant="ghost"]) {
    --button-bg: transparent;
    --button-fg: var(--foreground);
    --button-border: transparent;
    --button-hover-bg: var(--muted);
    --button-active-bg: var(--muted);
  }

  :host([variant="link"]) {
    --button-bg: transparent;
    --button-fg: var(--foreground);
    --button-border: transparent;
    --button-hover-bg: transparent;
    --button-active-bg: transparent;
  }

  /* --- Sizes (swap dimensions) --- */

  :host([size="sm"]) {
    --button-height: var(--component-height-sm);
    --button-padding-y: var(--space-1_5);
    --button-padding-x: var(--space-2);
    --button-gap: var(--space-1);
    --button-font-size: var(--font-size-xs);
    --button-icon-size: var(--space-4);
  }

  :host([size="lg"]) {
    --button-height: var(--component-height-lg);
    --button-padding-y: var(--space-2_5);
    --button-padding-x: var(--space-3);
    --button-gap: var(--space-1_5);
    --button-font-size: var(--font-size-sm);
    --button-icon-size: var(--space-4_5);
  }

  /* --- Base appearance --- */

  [part="root"] {
    --icon-size: var(--button-icon-size);
    --icon-color: var(--button-fg);
    gap: var(--button-gap);
    padding: var(--button-padding-y) var(--button-padding-x);
    width: var(--button-width);
    height: var(--button-height);
    border: var(--border-width-thin) solid var(--button-border);
    border-radius: var(--button-radius);
    background: var(--button-bg);
    color: var(--button-fg);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-medium);
    font-size: var(--button-font-size);
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-snug);
    white-space: nowrap;
    transition-duration: var(--duration-faster);
    transition-timing-function: var(--ease-out-3);
  }

  /* --- Interactive states --- */

  [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    background: var(--button-hover-bg);
  }

  [part="root"]:active:not(:disabled):not([aria-disabled="true"]) {
    background: var(--button-active-bg);
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  [part="root"]:disabled,
  [part="root"][aria-disabled="true"] {
    opacity: 0.2;
    cursor: not-allowed;
  }

  :host([variant="link"])
    [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  :host([data-open]) [part="root"]:not(:disabled):not([aria-disabled="true"]) {
    background: var(--button-hover-bg);
  }
`;
