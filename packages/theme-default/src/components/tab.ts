import { css } from "lit";

export const tabStyles = css`
  [part="tab"] {
    color: var(--muted-foreground);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-snug);
    font-weight: var(--font-weight-medium);
    padding-inline: var(--space-2);
    height: 2rem;
    transition-duration: var(--duration-fast);
  }

  [part="tab"][data-active] {
    color: var(--foreground);
  }

  @media (hover: hover) {
    [part="tab"]:hover:not([data-disabled]) {
      color: var(--foreground);
    }
  }

  [part="tab"]:focus-visible {
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
    border-radius: var(--radius-sm);
    z-index: 1;
  }

  [part="tab"][data-disabled] {
    opacity: 0.5;
  }
`;
