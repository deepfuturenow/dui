import { css } from "lit";

export const switchStyles = css`
  :host {
    --switch-width: var(--space-9);
    --switch-height: var(--space-5);
    --switch-thumb-size: var(--space-4);
    --switch-thumb-offset: var(--space-0_5);
    --track-inner: calc(var(--switch-width) - var(--switch-thumb-offset) * 2);
    --switch-checked-offset: calc(var(--track-inner) - var(--switch-thumb-size));
    gap: var(--space-2);
  }

  [part="root"] {
    width: var(--switch-width);
    height: var(--switch-height);
    margin-block-start: calc(
      (var(--line-height-normal) * 1em - var(--switch-height)) / 2
    );
    border-radius: calc(var(--switch-height) / 2);
    outline: var(--border-width-thin) solid var(--input);
    background: color-mix(in oklch, var(--input) 50%, transparent);
    transition-duration: var(--duration-fast);
  }

  [part="root"][data-checked] {
    background: var(--primary);
    outline-color: var(--primary);
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  [part="root"][data-readonly] {
    cursor: default;
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  [part="root"][data-invalid] {
    background: color-mix(in oklch, var(--destructive) 15%, transparent);
    outline-color: color-mix(in oklch, var(--destructive) 70%, transparent);
  }

  [part="root"][data-invalid][data-checked] {
    background: var(--destructive);
  }

  [part="thumb"] {
    width: var(--switch-thumb-size);
    height: var(--switch-thumb-size);
    border-radius: 50%;
    outline: 1px solid transparent;
    background: var(--primary);
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  [part="root"][data-checked] [part="thumb"] {
    background: var(--primary-foreground);
    outline-color: var(--primary-foreground);
  }
`;
