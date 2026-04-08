import { css } from "lit";

export const tooltipPopupStyles = css`
  .Popup {
    padding: var(--space-0_5) var(--space-1_5);
    border-radius: var(--radius-sm);
    background: color-mix(
      in oklch,
      var(--foreground) 90%,
      oklch(0 0 0 / 0)
    );
    backdrop-filter: blur(5px);
    color: var(--background);
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    line-height: var(--line-height-snug);
    box-shadow: var(--shadow-sm);
    max-width: 20rem;
    transition-duration: var(--duration-fastest);
    transition-timing-function: var(--ease-out-3);
  }

  .Arrow .arrow-fill {
    fill: color-mix(in oklch, var(--foreground) 90%, oklch(0 0 0 / 0));
  }

  .Arrow .arrow-stroke {
    fill: none;
    stroke: none;
  }
`;
