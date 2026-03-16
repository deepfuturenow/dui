import { css } from "lit";

export const breadcrumbSeparatorStyles = css`
  [part="root"] {
    --icon-size: var(--space-3_5);
    color: color-mix(in oklch, var(--muted-foreground) 50%, transparent);
  }
`;
