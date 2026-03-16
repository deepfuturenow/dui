import { css } from "lit";

export const breadcrumbLinkStyles = css`
  [part="root"] {
    color: var(--muted-foreground);
  }

  [part="root"] ::slotted(a) {
    color: inherit;
    text-decoration: none;
    transition: color var(--duration-fast);
  }

  [part="root"] ::slotted(a:hover) {
    color: var(--foreground);
  }
`;
