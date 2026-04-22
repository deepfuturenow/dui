import { css } from "lit";

export const menuStyles = css`
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

  .Menu dui-separator {
    margin: var(--space-1) var(--space-2);
  }
`;
