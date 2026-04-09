import { css } from "lit";
import { type } from "../typography.ts";

export const sidebarGroupLabelStyles = css`
  :host {
    margin-left: var(--sidebar-group-label-inset);
    height: var(--component-height-sm);
    color: var(--sidebar-muted-fg);
    font-family: var(--font-sans);
    ${type("xs", { lineHeight: "var(--line-height-snug)" })}
    font-weight: var(--font-weight-medium);
  }

  :host([data-icon-collapsed]) {
    margin-top: calc(-1 * var(--component-height-sm));
    transition-property: margin-top, opacity;
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-out-3);
  }
`;
