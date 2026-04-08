import { css } from "lit";

export const buttonStyles = css`
  /* =================================================================
   * Two-axis variant system:
   *   variant   → semantic intent (neutral, primary, danger, …)
   *   appearance → visual treatment (filled, outline, ghost, link)
   *
   * Layer 1 — Intent sets semantic color tokens (--_intent-*)
   * Layer 2 — Appearance maps intent tokens to component variables
   * ================================================================= */

  /* ---------------------------------------------------------------
   * Layer 1 — Intent (sets --_intent-* private tokens)
   * --------------------------------------------------------------- */

  :host,
  :host([variant=""]),
  :host([variant="neutral"]) {
    --_intent-base: var(--neutral);
    --_intent-base-fg: var(--neutral-foreground);
    --_intent-hover: var(--neutral-hover);
    --_intent-subtle: var(--neutral-subtle);
    --_intent-subtle-fg: var(--neutral-subtle-foreground);
  }

  :host([variant="primary"]) {
    --_intent-base: var(--primary);
    --_intent-base-fg: var(--primary-foreground);
    --_intent-hover: var(--primary-hover);
    --_intent-subtle: var(--primary-subtle);
    --_intent-subtle-fg: var(--primary-subtle-foreground);
  }

  :host([variant="danger"]) {
    --_intent-base: var(--danger);
    --_intent-base-fg: var(--danger-foreground);
    --_intent-hover: var(--danger-hover);
    --_intent-subtle: var(--danger-subtle);
    --_intent-subtle-fg: var(--danger-subtle-foreground);
  }

  :host([variant="success"]) {
    --_intent-base: var(--success);
    --_intent-base-fg: var(--success-foreground);
    --_intent-hover: var(--success-hover);
    --_intent-subtle: var(--success-subtle);
    --_intent-subtle-fg: var(--success-subtle-foreground);
  }

  :host([variant="warning"]) {
    --_intent-base: var(--warning);
    --_intent-base-fg: var(--warning-foreground);
    --_intent-hover: var(--warning-hover);
    --_intent-subtle: var(--warning-subtle);
    --_intent-subtle-fg: var(--warning-subtle-foreground);
  }

  /* ---------------------------------------------------------------
   * Layer 2 — Appearance (maps --_intent-* to --button-*)
   * --------------------------------------------------------------- */

  :host,
  :host([appearance=""]),
  :host([appearance="filled"]) {
    --button-bg: var(--_intent-base);
    --button-fg: var(--_intent-base-fg);
    --button-border: transparent;
    --button-hover-bg: var(--_intent-hover);
    --button-active-bg: color-mix(in oklch, var(--_intent-hover) 90%, var(--foreground));
  }

  :host([appearance="outline"]) {
    --button-bg: transparent;
    --button-fg: var(--_intent-base);
    --button-border: var(--input);
    --button-hover-bg: var(--_intent-subtle);
    --button-active-bg: color-mix(in oklch, var(--_intent-subtle) 90%, var(--foreground));
  }

  :host([appearance="ghost"]) {
    --button-bg: transparent;
    --button-fg: var(--_intent-base);
    --button-border: transparent;
    --button-hover-bg: var(--_intent-subtle);
    --button-active-bg: color-mix(in oklch, var(--_intent-subtle) 90%, var(--foreground));
  }

  :host([appearance="link"]) {
    --button-bg: transparent;
    --button-fg: var(--_intent-base);
    --button-border: transparent;
    --button-hover-bg: transparent;
    --button-active-bg: transparent;
  }

  /* ---------------------------------------------------------------
   * Sizes (swap dimensions)
   * --------------------------------------------------------------- */

  :host {
    --button-height: var(--component-height-md);
    --button-width: auto;
    --button-padding-y: var(--space-2);
    --button-padding-x: var(--space-2_5);
    --button-gap: var(--space-1_5);
    --button-radius: var(--radius-md);
    --button-font-size: var(--font-size-sm);
    --button-icon-size: var(--space-4_5);
  }

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

  /* ---------------------------------------------------------------
   * Base appearance
   * --------------------------------------------------------------- */

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
    transition-property: background, box-shadow, filter, transform, border-color;
    transition-duration: var(--duration-faster);
    transition-timing-function: var(--ease-out-3);
  }

  /* ---------------------------------------------------------------
   * Interactive states
   * --------------------------------------------------------------- */

  [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    background: var(--button-hover-bg);
  }

  [part="root"]:active:not(:disabled):not([aria-disabled="true"]) {
    background: var(--button-active-bg);
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"]:disabled,
  [part="root"][aria-disabled="true"] {
    opacity: 0.2;
    cursor: not-allowed;
  }

  /* Link appearance: underline on hover */
  :host([appearance="link"])
    [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  /* Open state (e.g. button is a popover trigger) */
  :host([data-open]) [part="root"]:not(:disabled):not([aria-disabled="true"]) {
    background: var(--button-hover-bg);
  }
`;
