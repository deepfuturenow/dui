import { css } from "lit";
import { type } from "../typography.ts";

export const popoverPopupStyles = css`
  .Popup {
    padding: var(--space-1);
    border-radius: var(--radius-md);
    background: var(--surface-3);
    color: var(--text-1);
    font-family: var(--font-sans);
    ${type("sm")}
    box-shadow: var(--shadow-md);
    border: var(--border-width-thin) solid var(--border);
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .Arrow .arrow-fill {
    fill: var(--surface-3);
  }

  .Arrow .arrow-stroke {
    fill: none;
    stroke: var(--border);
    stroke-width: 1px;
  }
`;
