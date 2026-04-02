import { css } from "lit";

export const toggleStyles = css`
  [part="root"] {
    height: var(--space-9);
    padding: 0 var(--space-2_5);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--muted-foreground);
    transition-property: background, color;
    transition-duration: var(--duration-fast);
  }

  @media (hover: hover) {
    [part="root"]:hover:not(:disabled):not([data-pressed]) {
      background: var(--muted);
      color: var(--foreground);
    }
  }

  [part="root"][data-pressed] {
    background: var(--secondary);
    color: var(--foreground);
  }

  [part="root"]:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  [part="root"]:disabled {
    opacity: 0.5;
  }
`;
