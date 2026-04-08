import { css } from "lit";

export const tabsPanelStyles = css`
  [part="panel"] {
    transition-duration: var(--duration-fast);
  }

  [part="panel"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    border-radius: var(--radius-md);
  }
`;
