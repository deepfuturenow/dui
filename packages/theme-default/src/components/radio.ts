import { css } from "lit";

export const radioStyles = css`
  :host {
    --radio-size: var(--space-4_5);
    gap: var(--space-2);
  }

  [part="root"] {
    width: var(--radio-size);
    height: var(--radio-size);
    border-radius: 50%;
    transition-property: background, border-color, box-shadow, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="root"][data-unchecked] {
    border: var(--border-width-thin) solid var(--border);
    background: var(--sunken);
  }

  [part="root"][data-checked] {
    border: var(--border-width-thin) solid var(--accent);
    background: var(--accent);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"][data-invalid] {
    border-color: color-mix(in oklch, var(--destructive) 70%, transparent);
    background: color-mix(in oklch, var(--destructive) 15%, transparent);
  }

  [part="dot"] {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: oklch(from var(--accent) 0.98 0.01 h);
  }
`;
