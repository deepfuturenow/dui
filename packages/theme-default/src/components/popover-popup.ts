import { css } from "lit";

export const popoverPopupStyles = css`
  .Popup {
    padding: var(--space-1);
    border-radius: var(--radius-md);
    background: var(--surface-3);
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
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
