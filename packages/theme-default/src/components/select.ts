import { css } from "lit";
import { type } from "../typography.ts";

export const selectStyles = css`
  .Trigger {
    height: var(--component-height-md);
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--sunken);
    color: var(--text-1);
    font-family: var(--font-sans);
    ${type("sm")}
    transition-property: border-color, box-shadow, background, filter, transform;
    transition-duration: var(--duration-fast);
  }

  .Trigger:focus {
    outline: none;
  }

  .Trigger:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  .Trigger[data-open] {
    filter: brightness(0.92);
  }

  .Trigger[data-disabled] {
    opacity: 0.4;
  }

  .Trigger[data-invalid] {
    border-color: var(--destructive);
  }

  .Value[data-placeholder] {
    color: var(--text-3);
  }

  .Icon {
    --icon-size: var(--space-4);
    color: var(--text-1);
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

  .Listbox {
    padding: var(--space-1);
  }

  .Item {
    gap: var(--space-2);
    padding: var(--space-1_5) var(--space-2);
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

  .Item[data-selected] {
    font-weight: var(--font-weight-medium);
  }

  .Item[data-disabled] {
    opacity: 0.4;
  }

  .ItemIndicator {
    width: var(--space-3_5);
  }

  .ItemIndicator dui-icon {
    --icon-size: var(--space-3_5);
  }
`;
