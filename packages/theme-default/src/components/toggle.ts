import { css } from "lit";

export const toggleStyles = css`
  /* ---------------------------------------------------------------
   * Sizes (swap dimensions)
   * --------------------------------------------------------------- */

  :host {
    --toggle-height: var(--component-height-md);
    --toggle-padding-y: var(--space-2);
    --toggle-padding-x: var(--space-2_5);
    --toggle-gap: var(--space-1_5);
    --toggle-radius: var(--radius-md);
    --toggle-font-size: var(--font-size-sm);
    --toggle-icon-size: var(--space-4_5);
  }

  :host([size="sm"]) {
    --toggle-height: var(--component-height-sm);
    --toggle-padding-y: var(--space-1_5);
    --toggle-padding-x: var(--space-2);
    --toggle-gap: var(--space-1);
    --toggle-font-size: var(--font-size-xs);
    --toggle-icon-size: var(--space-4);
  }

  :host([size="lg"]) {
    --toggle-height: var(--component-height-lg);
    --toggle-padding-y: var(--space-2_5);
    --toggle-padding-x: var(--space-3);
    --toggle-gap: var(--space-1_5);
    --toggle-font-size: var(--font-size-sm);
    --toggle-icon-size: var(--space-4_5);
  }

  /* ---------------------------------------------------------------
   * Base appearance — --_select / --_interact alpha overlay pattern
   * --------------------------------------------------------------- */

  [part="root"] {
    --_select: 0;
    --_interact: 0;
    --icon-size: var(--toggle-icon-size);
    --icon-color: currentColor;
    gap: var(--toggle-gap);
    padding: var(--toggle-padding-y) var(--toggle-padding-x);
    height: var(--toggle-height);
    border-radius: var(--toggle-radius);
    border: var(--border-width-thin) solid var(--border);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-medium);
    font-size: var(--toggle-font-size);
    letter-spacing: var(--letter-spacing-tight);
    line-height: var(--line-height-snug);
    white-space: nowrap;
    color: var(--text-2);
    background: oklch(from var(--foreground) l c h / calc(var(--_select) + var(--_interact)));
    transition-property: background, color, box-shadow;
    transition-duration: var(--duration-fast);
    min-width: var(--toggle-height);
  }

  @media (hover: hover) {
    [part="root"]:hover:not(:disabled):not([data-pressed]) {
      --_interact: 0.05;
      color: var(--text-1);
    }
  }

  [part="root"][data-pressed] {
    --_select: 0.10;
    color: var(--text-1);
  }

  [part="root"]:active:not(:disabled) {
    --_interact: 0.10;
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"]:disabled {
    opacity: 0.4;
  }
`;
