import { css } from "lit";
import { DuiButtonPrimitive } from "@dui/primitives/button";
import "../_install.ts";

const styles = css`
  /* =================================================================
   * Two-axis variant system:
   *   variant   → semantic intent (neutral, primary, danger)
   *   appearance → visual treatment (filled, outline, ghost, link)
   *
   * Uses the --_interact alpha overlay pattern for hover/active states.
   * ================================================================= */

  /* ---------------------------------------------------------------
   * Layer 1 — Intent (sets --_intent-* private tokens)
   * --------------------------------------------------------------- */

  :host,
  :host([variant=""]),
  :host([variant="neutral"]) {
    --_intent-base: var(--foreground);
    --_intent-base-fg: var(--background);
    --_intent-subtle: oklch(from var(--foreground) l c h / 0.08);
    --_intent-subtle-fg: var(--text-1);
    --_intent-border: var(--border);
  }

  :host([variant="primary"]) {
    --_intent-base: var(--accent);
    --_intent-base-fg: oklch(from var(--accent) 0.98 0.01 h);
    --_intent-subtle: var(--accent-subtle);
    --_intent-subtle-fg: var(--accent-text);
    --_intent-border: oklch(from var(--accent) l c h / 0.5);
  }

  :host([variant="danger"]) {
    --_intent-base: var(--destructive);
    --_intent-base-fg: oklch(from var(--destructive) 0.98 0.01 h);
    --_intent-subtle: var(--destructive-subtle);
    --_intent-subtle-fg: var(--destructive-text);
    --_intent-border: oklch(from var(--destructive) l c h / 0.5);
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
  }

  :host([appearance="outline"]) {
    --button-bg: oklch(from var(--_intent-base) l c h / 0);
    --button-fg: var(--_intent-subtle-fg);
    --button-border: var(--_intent-border);
  }

  :host([appearance="ghost"]) {
    --button-bg: oklch(from var(--_intent-base) l c h / 0);
    --button-fg: var(--_intent-subtle-fg);
    --button-border: transparent;
  }

  :host([appearance="soft"]) {
    --button-bg: var(--_intent-subtle);
    --button-fg: var(--_intent-subtle-fg);
    --button-border: transparent;
  }

  :host([appearance="link"]) {
    --button-bg: transparent;
    --button-fg: var(--_intent-subtle-fg);
    --button-border: transparent;
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
    --button-font-size: var(--text-sm);
    --button-icon-size: var(--space-4_5);
    width: var(--button-width);
  }

  :host([size="xs"]) {
    --button-height: var(--component-height-xs);
    --button-padding-y: var(--space-1);
    --button-padding-x: var(--space-1_5);
    --button-gap: var(--space-1);
    --button-font-size: var(--text-xs);
    --button-icon-size: var(--space-3_5);
  }

  :host([size="sm"]) {
    --button-height: var(--component-height-sm);
    --button-padding-y: var(--space-1_5);
    --button-padding-x: var(--space-2);
    --button-gap: var(--space-1);
    --button-font-size: var(--text-xs);
    --button-icon-size: var(--space-4);
  }

  :host([size="lg"]) {
    --button-height: var(--component-height-lg);
    --button-padding-y: var(--space-2_5);
    --button-padding-x: var(--space-3);
    --button-gap: var(--space-1_5);
    --button-font-size: var(--text-sm);
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
    text-box: trim-both cap alphabetic;
    white-space: nowrap;
    transition-property: background, box-shadow, filter, transform, border-color, text-decoration-color;
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  /* ---------------------------------------------------------------
   * Interactive states — filled variant uses filter for hover/active
   * --------------------------------------------------------------- */

  /* Filled: darken on hover, more on active */
  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]):not([appearance="link"]))
    [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    filter: brightness(0.88);
  }

  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]):not([appearance="link"]))
    [part="root"]:active:not(:disabled):not([aria-disabled="true"]) {
    filter: brightness(0.80);
  }

  /* Ghost / outline: alpha overlay on foreground */
  :host([appearance="ghost"]) [part="root"]:hover:not(:disabled):not([aria-disabled="true"]),
  :host([appearance="outline"]) [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    background: oklch(from var(--_intent-base) l c h / 0.05);
  }

  :host([appearance="ghost"]) [part="root"]:active:not(:disabled):not([aria-disabled="true"]),
  :host([appearance="outline"]) [part="root"]:active:not(:disabled):not([aria-disabled="true"]) {
    background: oklch(from var(--_intent-base) l c h / 0.10);
  }

  /* Soft: layer intent color on top of tinted background */
  :host([appearance="soft"])
    [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    background: oklch(from var(--_intent-base) l c h / 0.12);
  }

  :host([appearance="soft"])
    [part="root"]:active:not(:disabled):not([aria-disabled="true"]) {
    background: oklch(from var(--_intent-base) l c h / 0.18);
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

  /* Link appearance: persistent transparent underline, fades in on hover */
  :host([appearance="link"]) [part="root"] {
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-color: transparent;
  }

  :host([appearance="link"])
    [part="root"]:hover:not(:disabled):not([aria-disabled="true"]) {
    text-decoration-color: currentColor;
  }

  /* Open state — mirrors :active so the trigger looks pressed while its overlay is open */

  :host([data-open]:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]):not([appearance="link"]))
    [part="root"]:not(:disabled):not([aria-disabled="true"]) {
    filter: brightness(0.80);
  }

  :host([data-open][appearance="ghost"]) [part="root"]:not(:disabled):not([aria-disabled="true"]),
  :host([data-open][appearance="outline"]) [part="root"]:not(:disabled):not([aria-disabled="true"]) {
    background: oklch(from var(--_intent-base) l c h / 0.10);
  }

  :host([data-open][appearance="soft"]) [part="root"]:not(:disabled):not([aria-disabled="true"]) {
    background: oklch(from var(--_intent-base) l c h / 0.18);
  }
`;

export class DuiButton extends DuiButtonPrimitive {
  static override styles = [...DuiButtonPrimitive.styles, styles];
}

customElements.define(DuiButton.tagName, DuiButton);
