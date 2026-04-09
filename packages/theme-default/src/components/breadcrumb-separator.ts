import { css } from "lit";

export const breadcrumbSeparatorStyles = css`
  [part="root"] {
    --icon-size: var(--space-3_5);
    color: color-mix(in oklch, var(--text-2) 50%, transparent);
  }
`;
