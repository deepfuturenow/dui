import { css } from "lit";

export const fieldsetStyles = css`
  [part="root"] {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }

  [part="legend"] {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-normal);
    color: var(--text-1);
    margin-bottom: var(--space-2);
  }
`;
