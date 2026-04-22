import { css } from "lit";

export const stepperStyles = css`
  [part="root"] {
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: transparent;
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
  }

  [part="root"]:focus-within {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }

  :host([aria-invalid="true"]) [part="root"] {
    border-color: var(--destructive);
  }

  [part="input"] {
    height: var(--component-height-md);
    width: var(--space-16);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-1);
  }

  :host([size="sm"]) [part="input"] {
    height: var(--component-height-sm);
    width: var(--space-14);
    font-size: var(--text-xs);
  }

  [part="decrement"],
  [part="increment"] {
    width: var(--component-height-md);
    height: var(--component-height-md);
    color: var(--text-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-lg);
    transition-property: background, color;
    transition-duration: var(--duration-fast);
  }

  :host([size="sm"]) [part="decrement"],
  :host([size="sm"]) [part="increment"] {
    width: var(--component-height-sm);
    height: var(--component-height-sm);
  }

  @media (hover: hover) {
    [part="decrement"]:hover:not(:disabled),
    [part="increment"]:hover:not(:disabled) {
      background: var(--surface-1);
      color: var(--text-1);
    }
  }

  [part="decrement"]:disabled,
  [part="increment"]:disabled {
    opacity: 0.4;
  }
`;
