import { css } from "lit";

export const commandItemStyles = css`
  .Item {
    gap: var(--space-2);
    border-radius: var(--radius-sm);
    padding: var(--space-1_5) var(--space-2);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    text-box: trim-both cap alphabetic;
    font-weight: var(--font-weight-medium);
  }

  .Item[data-selected] {
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  .Item[aria-disabled="true"] {
    opacity: 0.4;
  }

  ::slotted(dui-icon) {
    --icon-size: var(--space-4);
    color: var(--text-2);
  }
`;
