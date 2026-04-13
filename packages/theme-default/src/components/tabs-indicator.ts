import { css } from "lit";

export const tabsIndicatorStyles = css`
  :host {
    height: var(--component-height-xs);
    border-radius: var(--radius-sm);
    background: oklch(from var(--foreground) l c h / 0.08);
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-in-out-3);
  }
`;
