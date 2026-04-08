import { css } from "lit";

export const sliderStyles = css`
  :host {
    --slider-track-height: var(--space-1_5);
    --slider-thumb-size: var(--space-4_5);
  }

  [part="root"] {
    height: var(--slider-thumb-size);
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
  }

  [part="track"] {
    height: var(--slider-track-height);
    background: var(--muted);
    border-radius: calc(var(--slider-track-height) / 2);
  }

  [part="indicator"] {
    background: var(--primary);
    border-radius: calc(var(--slider-track-height) / 2);
    transition: width 50ms ease-out;
  }

  [part="root"][data-dragging] [part="indicator"] {
    transition: none;
  }

  [part="thumb"] {
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    background: var(--background);
    border: 2px solid var(--primary);
    border-radius: 50%;
    transition-property: left, box-shadow;
    transition-duration: 50ms, var(--duration-fast);
    transition-timing-function: ease-out, ease;
  }

  [part="root"][data-dragging] [part="thumb"] {
    transition: box-shadow var(--duration-fast);
  }

  @media (hover: hover) {
    [part="thumb"]:hover {
      box-shadow: 0 0 0 4px color-mix(in oklch, var(--primary) 20%, transparent);
    }
  }

  [part="thumb"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }
`;
