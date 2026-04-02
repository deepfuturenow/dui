import { css } from "lit";

export const tabsListStyles = css`
  [part="list"] {
    padding-inline: 0;
    gap: 0;
  }

  [part="list"][data-orientation="vertical"] {
    box-shadow: inset -1px 0 var(--border);
    padding-inline: 0;
    padding-block: var(--space-1);
  }
`;
