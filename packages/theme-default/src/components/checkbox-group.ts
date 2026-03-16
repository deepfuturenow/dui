import { css } from "lit";

export const checkboxGroupStyles = css`
  [part="root"] {
    gap: var(--space-1);
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
  }
`;
