import { css } from "lit";

export const tabsIndicatorStyles = css`
  :host {
    height: 1.5rem;
    border-radius: var(--radius-sm);
    background: oklch(from var(--foreground) l c h / 0.08);
    transition-duration: 200ms;
    transition-timing-function: var(--ease-in-out-3);
  }
`;
