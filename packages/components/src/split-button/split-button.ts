import { css } from "lit";
import { DuiSplitButtonPrimitive } from "@dui/primitives/split-button";
import "../_install.ts";

const styles = css`
  /* =================================================================
   * Reuses the button's two-axis variant system:
   *   variant   → semantic intent (neutral, primary, danger)
   *   appearance → visual treatment (filled, outline, ghost)
   *
   * The whole .Root renders as one unified button shape. The action
   * and trigger zones share the same background/border/radius.
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
   * Layer 2 — Appearance (maps --_intent-* to --sb-*)
   * --------------------------------------------------------------- */

  :host,
  :host([appearance=""]),
  :host([appearance="filled"]) {
    --sb-bg: var(--_intent-base);
    --sb-fg: var(--_intent-base-fg);
    --sb-border: transparent;
    --sb-divider: oklch(from var(--_intent-base-fg) l c h / 0.25);
  }

  :host([appearance="outline"]) {
    --sb-bg: transparent;
    --sb-fg: var(--_intent-subtle-fg);
    --sb-border: var(--border);
    --sb-divider: var(--border);
  }

  :host([appearance="ghost"]) {
    --sb-bg: transparent;
    --sb-fg: var(--_intent-subtle-fg);
    --sb-border: transparent;
    --sb-divider: var(--border);
  }

  :host([appearance="soft"]) {
    --sb-bg: var(--_intent-subtle);
    --sb-fg: var(--_intent-subtle-fg);
    --sb-border: transparent;
    --sb-divider: oklch(from var(--_intent-base) l c h / 0.15);
  }

  /* ---------------------------------------------------------------
   * Sizes
   * --------------------------------------------------------------- */

  :host {
    --sb-height: var(--component-height-md);
    --sb-action-padding-y: var(--space-2);
    --sb-action-padding-x: var(--space-2_5);
    --sb-trigger-padding-x: var(--space-1_5);
    --sb-gap: var(--space-1_5);
    --sb-radius: var(--radius-md);
    --sb-font-size: var(--text-sm);
    --sb-icon-size: var(--space-4_5);
    --sb-trigger-icon-size: var(--space-4);
  }

  :host([size="xs"]) {
    --sb-height: var(--component-height-xs);
    --sb-action-padding-y: var(--space-1);
    --sb-action-padding-x: var(--space-1_5);
    --sb-trigger-padding-x: var(--space-1);
    --sb-gap: var(--space-1);
    --sb-font-size: var(--text-xs);
    --sb-icon-size: var(--space-3_5);
    --sb-trigger-icon-size: var(--space-3);
  }

  :host([size="sm"]) {
    --sb-height: var(--component-height-sm);
    --sb-action-padding-y: var(--space-1_5);
    --sb-action-padding-x: var(--space-2);
    --sb-trigger-padding-x: var(--space-1_5);
    --sb-gap: var(--space-1);
    --sb-font-size: var(--text-xs);
    --sb-icon-size: var(--space-4);
    --sb-trigger-icon-size: var(--space-3_5);
  }

  :host([size="lg"]) {
    --sb-height: var(--component-height-lg);
    --sb-action-padding-y: var(--space-2_5);
    --sb-action-padding-x: var(--space-3);
    --sb-trigger-padding-x: var(--space-2);
    --sb-gap: var(--space-1_5);
    --sb-font-size: var(--text-sm);
    --sb-icon-size: var(--space-4_5);
    --sb-trigger-icon-size: var(--space-4);
  }

  /* ---------------------------------------------------------------
   * Root container — unified button shape
   * --------------------------------------------------------------- */

  .Root {
    height: var(--sb-height);
    border: var(--border-width-thin) solid var(--sb-border);
    border-radius: var(--sb-radius);
    background: var(--sb-bg);
    color: var(--sb-fg);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-medium);
    font-size: var(--sb-font-size);
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-snug);
    white-space: nowrap;
    overflow: hidden;
  }

  /* ---------------------------------------------------------------
   * Action button (left)
   * --------------------------------------------------------------- */

  [part="action"] {
    --icon-size: var(--sb-icon-size);
    --icon-color: var(--sb-fg);
    gap: var(--sb-gap);
    padding: var(--sb-action-padding-y) var(--sb-action-padding-x);
    height: 100%;
    color: inherit;
    font: inherit;
    letter-spacing: inherit;
    line-height: inherit;
    transition-property: background, filter;
    transition-duration: var(--duration-faster);
    transition-timing-function: var(--ease-out-3);
  }

  /* ---------------------------------------------------------------
   * Divider
   * --------------------------------------------------------------- */

  [part="divider"] {
    border-left: var(--border-width-thin) solid var(--sb-divider);
  }

  /* ---------------------------------------------------------------
   * Trigger button (right)
   * --------------------------------------------------------------- */

  [part="trigger"] {
    --icon-size: var(--sb-trigger-icon-size);
    --icon-color: var(--sb-fg);
    padding: 0 var(--sb-trigger-padding-x);
    height: 100%;
    background: var(--sb-trigger-bg, var(--sb-bg));
    color: inherit;
    transition-property: background, filter;
    transition-duration: var(--duration-faster);
    transition-timing-function: var(--ease-out-3);
  }

  /* ---------------------------------------------------------------
   * Interactive states — filled uses filter, outline/ghost use alpha
   * --------------------------------------------------------------- */

  /* Filled hover */
  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]))
    [part="action"]:hover:not(:disabled) {
    filter: brightness(0.88);
  }

  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]))
    [part="trigger"]:hover:not(:disabled) {
    filter: brightness(0.88);
  }

  /* Filled active */
  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]))
    [part="action"]:active:not(:disabled) {
    filter: brightness(0.80);
  }

  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]))
    [part="trigger"]:active:not(:disabled) {
    filter: brightness(0.80);
  }

  /* Filled trigger open state */
  :host(:not([appearance="outline"]):not([appearance="ghost"]):not([appearance="soft"]))
    [part="trigger"][data-open]:not(:disabled) {
    filter: brightness(0.80);
  }

  /* Ghost / outline hover */
  :host([appearance="ghost"]) [part="action"]:hover:not(:disabled),
  :host([appearance="outline"]) [part="action"]:hover:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.05);
  }

  :host([appearance="ghost"]) [part="trigger"]:hover:not(:disabled),
  :host([appearance="outline"]) [part="trigger"]:hover:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.05);
  }

  /* Ghost / outline active */
  :host([appearance="ghost"]) [part="action"]:active:not(:disabled),
  :host([appearance="outline"]) [part="action"]:active:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.10);
  }

  :host([appearance="ghost"]) [part="trigger"]:active:not(:disabled),
  :host([appearance="outline"]) [part="trigger"]:active:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.10);
  }

  /* Ghost / outline trigger open state */
  :host([appearance="ghost"]) [part="trigger"][data-open]:not(:disabled),
  :host([appearance="outline"]) [part="trigger"][data-open]:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.10);
  }

  /* Soft hover */
  :host([appearance="soft"]) [part="action"]:hover:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.12);
  }

  :host([appearance="soft"]) [part="trigger"]:hover:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.12);
  }

  /* Soft active */
  :host([appearance="soft"]) [part="action"]:active:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.18);
  }

  :host([appearance="soft"]) [part="trigger"]:active:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.18);
  }

  /* Soft trigger open state */
  :host([appearance="soft"]) [part="trigger"][data-open]:not(:disabled) {
    background: oklch(from var(--_intent-base) l c h / 0.18);
  }

  /* Focus visible */
  [part="action"]:focus-visible,
  [part="trigger"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    z-index: 1;
    position: relative;
  }

  /* Disabled */
  :host([disabled]) .Root {
    opacity: 0.4;
    cursor: not-allowed;
  }

  [part="action"]:disabled,
  [part="trigger"]:disabled {
    cursor: not-allowed;
  }

  /* ---------------------------------------------------------------
   * Popup (rendered in portal shadow root)
   * --------------------------------------------------------------- */

  .Popup {
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .Popup[data-starting-style],
  .Popup[data-ending-style] {
    transform: translateY(calc(var(--space-1) * -1));
  }

  .Menu {
    padding: var(--space-1);
  }
`;

export class DuiSplitButton extends DuiSplitButtonPrimitive {
  static override styles = [...DuiSplitButtonPrimitive.styles, styles];
}

customElements.define(DuiSplitButton.tagName, DuiSplitButton);
