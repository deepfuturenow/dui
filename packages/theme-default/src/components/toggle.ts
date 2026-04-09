import { css } from "lit";

export const toggleStyles = css`
  /* --_select / --_interact alpha overlay pattern */

  [part="root"] {
    --_select: 0;
    --_interact: 0;
    --toggle-gap: var(--space-1_5);
    --icon-size: var(--space-4);
    --icon-color: currentColor;
    height: var(--component-height-md);
    padding: 0 var(--space-2_5);
    border-radius: var(--radius-md);
    border: var(--border-width-thin) solid var(--border);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-2);
    background: oklch(from var(--foreground) l c h / calc(var(--_select) + var(--_interact)));
    transition-property: background, color, box-shadow;
    transition-duration: var(--duration-fast);
    min-width: var(--component-height-md);
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
