import { css } from "lit";

export const tabsPanelStyles = css`
  [part="panel"] {
    transition-duration: var(--duration-fast);
  }

  [part="panel"]:focus-visible {
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
    border-radius: var(--radius-md);
  }
`;
