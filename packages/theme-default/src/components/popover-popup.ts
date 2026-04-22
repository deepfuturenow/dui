import { css } from "lit";

export const popoverPopupStyles = css`
  .Popup {
    padding: var(--popover-popup-padding, var(--space-4));
    border-radius: var(--radius-md);
    background: var(--surface-3);
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    box-shadow: var(--shadow-md);
    border: var(--border-width-thin) solid var(--border);
    transition-duration: var(--duration-faster);
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
