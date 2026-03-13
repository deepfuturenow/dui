import { css } from "lit";

export const comboboxStyles = css`
  /* ---- Chips (multi-select container) ---- */

  .Chips {
    gap: var(--space-1);
    border: var(--border-width-thin) solid var(--input);
    border-radius: var(--radius-md);
    padding: var(--space-1) var(--space-8) var(--space-1) var(--space-1_5);
    min-height: var(--component-height-md);
    background: var(--input-bg);
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
  }

  .Chips:focus-within:has(:focus-visible) {
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  .Chips[data-disabled] {
    opacity: 0.5;
  }

  /* ---- Input ---- */

  .Input {
    height: var(--component-height-md);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
  }

  .Input::placeholder {
    color: var(--muted-foreground);
  }

  /* Single-select input wrapper */
  .InputWrapper .Input {
    width: 100%;
    min-height: var(--component-height-md);
    padding: var(--space-2) var(--space-8) var(--space-2) var(--space-2);
    border: var(--border-width-thin) solid var(--input);
    border-radius: var(--radius-md);
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
    background: var(--input-bg);
  }

  .InputWrapper .Input:focus-visible {
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }

  .InputWrapper .Input[data-disabled] {
    opacity: 0.5;
  }

  .Arrow {
    --icon-size: var(--space-4);
    right: var(--space-3);
    color: var(--foreground);
  }

  /* Multi-select input (inside chips) */
  .Chips .Input {
    height: var(--space-6);
    margin-left: var(--space-1_5);
  }

  /* ---- Chip ---- */

  .Chip {
    gap: var(--space-1);
    background-color: var(--secondary);
    color: var(--secondary-foreground);
    border-radius: var(--radius-sm);
    font-size: var(--font-size-xs);
    padding: var(--space-0_5) var(--space-0_5) var(--space-0_5) var(--space-2);
  }

  .ChipRemove {
    padding: var(--space-0_5);
    color: inherit;
    border-radius: var(--radius-sm);
    --icon-size: var(--space-3_5);
  }

  .ChipRemove:hover {
    background-color: color-mix(
      in oklch,
      var(--secondary-foreground) 15%,
      transparent
    );
  }
`;
