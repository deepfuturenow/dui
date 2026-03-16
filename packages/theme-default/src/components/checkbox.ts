import { css } from "lit";

export const checkboxStyles = css`
  :host {
    --checkbox-size: var(--space-4_5);
    gap: var(--space-2);
  }

  [part="root"] {
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    margin-block-start: calc(
      (var(--line-height-normal) * 1em - var(--checkbox-size)) / 2
    );
    border-radius: var(--radius-sm);
    transition-duration: var(--duration-fast);
  }

  [part="root"][data-unchecked] {
    border: var(--border-width-thin) solid var(--input);
    background-color: transparent;
  }

  [part="root"][data-checked],
  [part="root"][data-indeterminate] {
    background-color: var(--primary);
    border: var(--border-width-thin) solid var(--primary);
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
    background-color: color-mix(in oklch, var(--destructive) 15%, transparent);
    border-color: color-mix(in oklch, var(--destructive) 70%, transparent);
  }

  [part="indicator"] {
    color: var(--primary-foreground);
  }

  .Icon {
    width: 12px;
    height: 12px;
  }
`;
