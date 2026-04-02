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
    transition-duration: var(--duration-fast);
  }

  [part="root"][data-unchecked] {
    border: var(--border-width-thin) solid var(--input);
    background: var(--input-bg);
  }

  [part="root"][data-checked] {
    border: var(--border-width-thin) solid var(--primary);
    background: var(--primary);
  }

  [part="root"][data-disabled] {
    opacity: 0.5;
  }

  [part="root"]:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  [part="root"][data-invalid] {
    border-color: color-mix(in oklch, var(--destructive) 70%, transparent);
    background: color-mix(in oklch, var(--destructive) 15%, transparent);
  }

  [part="dot"] {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--primary-foreground);
  }
`;
