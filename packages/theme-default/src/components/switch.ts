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
    font-size: var(--text-sm);
  }

  [part="root"] {
    width: var(--switch-width);
    height: var(--switch-height);
    margin-block-start: calc(
      (var(--line-height-normal) * 1em - var(--switch-height)) / 2
    );
    border-radius: calc(var(--switch-height) / 2);
    outline: var(--border-width-thin) solid oklch(from var(--foreground) l c h / 0.15);
    background: oklch(from var(--foreground) l c h / 0.12);
    transition-property: background, outline-color, box-shadow, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="root"][data-checked] {
    background: var(--accent);
    outline-color: var(--accent);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
    cursor: not-allowed;
  }

  [part="root"][data-readonly] {
    cursor: default;
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  :host([aria-invalid="true"]) [part="root"] {
    background: color-mix(in oklch, var(--destructive) 15%, transparent);
    outline-color: color-mix(in oklch, var(--destructive) 70%, transparent);
  }

  :host([aria-invalid="true"]) [part="root"][data-checked] {
    background: var(--destructive);
  }

  [part="thumb"] {
    width: var(--switch-thumb-size);
    height: var(--switch-thumb-size);
    border-radius: 50%;
    outline: var(--border-width-thin) solid oklch(from var(--foreground) l c h / 0.02);
    box-shadow: 0 1px 3px oklch(from var(--foreground) l c h / 0.2);
    background: white;
    transition-property: transform, outline-color;
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  [part="root"][data-checked] [part="thumb"] {
    background: oklch(from var(--accent) 0.98 0.01 h);
  }
`;
