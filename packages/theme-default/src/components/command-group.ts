import { css } from "lit";

export const commandGroupStyles = css`
  .Group {
    padding: var(--space-1_5);
  }

  .Heading {
    padding: var(--space-1_5) var(--space-2);
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    text-box: trim-both cap alphabetic;
    font-weight: var(--font-weight-medium);
    color: var(--text-2);
  }
`;
