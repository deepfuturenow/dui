import { css } from "lit";

export const commandItemStyles = css`
  .Item {
    gap: var(--space-2);
    border-radius: var(--radius-sm);
    padding: var(--space-1_5) var(--space-2);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .Item[data-selected] {
    background: var(--secondary);
    color: var(--foreground);
  }

  .Item[aria-disabled="true"] {
    opacity: 0.5;
  }

  ::slotted(dui-icon) {
    --icon-size: var(--space-4);
    color: var(--muted-foreground);
  }
`;
