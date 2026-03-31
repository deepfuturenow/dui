import { css } from "lit";

export const numberFieldStyles = css`
  [part="root"] {
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background-color: var(--background);
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
  }

  [part="root"]:focus-within {
    border-color: var(--ring);
    box-shadow: 0 0 0 var(--space-0_5) color-mix(in oklch, var(--ring) 25%, transparent);
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
  }

  [part="root"][data-invalid] {
    border-color: var(--destructive);
  }

  [part="input"] {
    height: var(--space-9);
    width: var(--space-16);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    color: var(--foreground);
  }

  [part="decrement"],
  [part="increment"] {
    width: var(--space-8);
    height: var(--space-8);
    color: var(--muted-foreground);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-lg);
    transition-property: background-color, color;
    transition-duration: var(--duration-fast);
  }

  @media (hover: hover) {
    [part="decrement"]:hover:not(:disabled),
    [part="increment"]:hover:not(:disabled) {
      background-color: var(--muted);
      color: var(--foreground);
    }
  }

  [part="decrement"]:disabled,
  [part="increment"]:disabled {
    opacity: 0.3;
  }
`;
