import { css } from "lit";

export const tabsListStyles = css`
  [part="list"] {
    padding-inline: var(--space-1);
    gap: var(--space-1);
    box-shadow: inset 0 -1px var(--border);
  }

  [part="list"][data-orientation="vertical"] {
    box-shadow: inset -1px 0 var(--border);
    padding-inline: 0;
    padding-block: var(--space-1);
  }
`;
