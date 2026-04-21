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
    opacity: 0.4;
  }

  /* -----------------------------------------------------------
   * New parts: hidden by default
   * ----------------------------------------------------------- */

  [part="label"] {
    display: none;
  }

  [part="readout"] {
    display: none;
  }

  [part="unit"] {
    display: none;
  }

  /* -----------------------------------------------------------
   * Track: gradient support via --slider-track-bg
   * ----------------------------------------------------------- */

  [part="track"] {
    height: var(--slider-track-height);
    background: var(--slider-track-bg, color-mix(in oklch, var(--foreground) 15%, transparent));
    border-radius: calc(var(--slider-track-height) / 2);
  }

  [part="indicator"] {
    background: var(--accent);
    border-radius: calc(var(--slider-track-height) / 2);
    transition: width var(--duration-fast) ease-out;
  }

  [part="root"][data-dragging] [part="indicator"] {
    transition: none;
  }

  [part="thumb"] {
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    background: var(--background);
    border: var(--border-width-medium) solid var(--accent);
    border-radius: 50%;
    transition-property: left, box-shadow;
    transition-duration: var(--duration-fast), var(--duration-fast);
    transition-timing-function: ease-out, ease;
  }

  [part="root"][data-dragging] [part="thumb"] {
    transition: box-shadow var(--duration-fast);
  }

  @media (hover: hover) {
    [part="thumb"]:hover {
      box-shadow: 0 0 0 var(--space-1) color-mix(in oklch, var(--accent) 20%, transparent);
    }
  }

  [part="thumb"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  /* -----------------------------------------------------------
   * Variant: field (compact slider-field with value readout)
   * ----------------------------------------------------------- */

  :host([variant="field"]) {
    --slider-track-height: var(--component-height-sm);
    /* --slider-thumb-size: 0px; */
  }

  :host([variant="field"]) [part="root"] {
    height: auto;
  }

  :host([variant="field"]) [part="track"] {
    border-radius: var(--radius-sm);
    border: var(--border-width-thin) solid var(--border);
    background: var(--slider-track-bg, transparent);
    transition: border-color var(--duration-fast);
  }

  :host([variant="field"]) [part="track"]:hover {
    border-color: var(--ring);
  }

  :host([variant="field"]) [part="indicator"] {
    background: var(--slider-indicator-color, var(--accent));
    opacity: var(--slider-indicator-opacity, 0.08);
    border-radius: var(--radius-sm);
  }





  :host([variant="field"][label]:not([label=""])) [part="label"] {
    display: flex;
    font-size: var(--text-xs);
    color: var(--muted-foreground);
    margin-bottom: var(--space-1);
  }

  :host([variant="field"][disabled]) {
    opacity: 0.5;
  }
`;
