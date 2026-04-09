import { css } from "lit";
import { type } from "../typography.ts";

export const comboboxStyles = css`
  /* ---- Chips (multi-select container) ---- */

  .Chips {
    gap: var(--space-1);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-1) var(--space-8) var(--space-1) var(--space-1_5);
    min-height: var(--component-height-md);
    background: var(--sunken);
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
  }

  .Chips:focus-within:has(:focus-visible) {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  .Chips[data-disabled] {
    opacity: 0.4;
  }

  /* ---- Input ---- */

  .Input {
    height: var(--component-height-md);
    color: var(--text-1);
    font-family: var(--font-sans);
    ${type("sm")}
  }

  .Input::placeholder {
    color: var(--text-2);
  }

  /* Single-select input wrapper */
  .InputWrapper .Input {
    width: 100%;
    min-height: var(--component-height-md);
    padding: var(--space-2) var(--space-8) var(--space-2) var(--space-2);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
    background: var(--sunken);
  }

  .InputWrapper .Input:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  .InputWrapper .Input[data-disabled] {
    opacity: 0.4;
  }

  .Arrow {
    --icon-size: var(--space-4);
    right: var(--space-3);
    color: var(--text-1);
  }

  /* Multi-select input (inside chips) */
  .Chips .Input {
    height: var(--space-6);
    margin-left: var(--space-1_5);
  }

  /* ---- Chip ---- */

  .Chip {
    gap: var(--space-1);
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
    border-radius: var(--radius-sm);
    ${type("xs")}
    padding: var(--space-0_5) var(--space-0_5) var(--space-0_5) var(--space-2);
  }

  .ChipRemove {
    padding: var(--space-0_5);
    color: inherit;
    border-radius: var(--radius-sm);
    --icon-size: var(--space-3_5);
  }

  .ChipRemove:hover {
    background: color-mix(
      in oklch,
      var(--text-1) 15%,
      transparent
    );
  }

  /* ---- Popup (rendered in portal shadow root) ---- */

  .Popup {
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .Popup[data-starting-style],
  .Popup[data-ending-style] {
    transform: translateY(calc(var(--space-1) * -1));
  }

  .List {
    padding: var(--space-1);
  }

  .Item {
    gap: var(--space-2);
    padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    ${type("sm")}
    font-family: var(--font-sans);
    color: var(--text-1);
  }

  .Item:hover,
  .Item[data-highlighted] {
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  .ItemIndicator {
    --icon-size: var(--space-3_5);
  }

  .Empty {
    padding: var(--space-3);
    ${type("sm")}
    color: var(--text-2);
    text-align: center;
  }
`;
