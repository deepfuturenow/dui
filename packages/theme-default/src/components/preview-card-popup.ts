import { css } from "lit";
import { type } from "../typography.ts";

export const previewCardPopupStyles = css`
  .Popup {
    padding: var(--space-4);
    border-radius: var(--radius-md);
    background: var(--surface-3);
    color: var(--text-1);
    font-family: var(--font-sans);
    ${type("sm")}
    box-shadow: var(--shadow-lg);
    border: var(--border-width-thin) solid var(--border);
    max-width: var(--max-width, var(--space-80));
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
