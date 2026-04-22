import { css } from "lit";

export const sidebarGroupLabelStyles = css`
  :host {
    margin-left: var(--sidebar-group-label-inset);
    height: var(--component-height-sm);
    color: var(--sidebar-muted-fg);
    font-family: var(--font-sans);
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    text-box: trim-both cap alphabetic;
    font-weight: var(--font-weight-medium);
  }

  :host([data-icon-collapsed]) {
    margin-top: calc(-1 * var(--component-height-sm));
    transition-property: margin-top, opacity;
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-out-3);
  }
`;
