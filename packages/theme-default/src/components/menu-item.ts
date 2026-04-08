import { css } from "lit";

export const menuItemStyles = css`
  .Item {
    --icon-size: var(--space-4);
    --icon-color: var(--muted-foreground);
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-sm);
    font-family: var(--font-sans);
    color: var(--popover-foreground);
  }

  .Item:hover,
  :host([data-highlighted]) .Item {
    --icon-color: var(--foreground);
    background: var(--secondary);
    color: var(--foreground);
  }

  :host([variant="danger"]) .Item {
    --icon-color: var(--destructive);
    color: var(--destructive);
  }

  :host([variant="danger"]) .Item:hover,
  :host([variant="danger"][data-highlighted]) .Item {
    --icon-color: var(--destructive-foreground);
    background: var(--destructive);
    color: var(--destructive-foreground);
  }

  :host([disabled]) .Item {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
