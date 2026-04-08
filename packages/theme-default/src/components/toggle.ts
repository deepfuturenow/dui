import { css } from "lit";

export const toggleStyles = css`
  [part="root"] {
    --toggle-gap: var(--space-1_5);
    --icon-size: var(--space-4);
    --icon-color: currentColor;
    height: var(--component-height-md);
    padding: 0 var(--space-2_5);
    border-radius: var(--radius-md);
    border: var(--border-width-thin) solid var(--input);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--muted-foreground);
    transition-property: background, color, box-shadow;
    transition-duration: var(--duration-fast);
    min-width: var(--component-height-md);
  }

  @media (hover: hover) {
    [part="root"]:hover:not(:disabled):not([data-pressed]) {
      background: var(--muted);
      color: var(--foreground);
    }
  }

  [part="root"][data-pressed] {
    background: var(--muted);
    /* border-color: color-mix(in oklch, var(--secondary), var(--foreground) 10%);
    background: var(--secondary); */
    color: var(--foreground);
  }

  [part="root"]:active {
    background: red;
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"]:disabled {
    opacity: 0.5;
  }
`;
