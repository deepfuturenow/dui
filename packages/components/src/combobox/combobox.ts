import { css } from "lit";
import { DuiComboboxPrimitive } from "@dui/primitives/combobox";
import "../_install.ts";

const styles = css`
  /* ---------------------------------------------------------------
   * Size tokens. The popup now renders in this same shadow root (native
   * top-layer [popover]), so the --combobox-item-* vars set on the host
   * inherit to the option rows directly — no forwarding needed.
   * --------------------------------------------------------------- */

  :host {
    --combobox-item-font-size: var(--text-sm);
    --combobox-item-padding-y: var(--space-2);
    --combobox-item-icon-size: var(--space-3_5);
  }

  :host([size="xs"]) {
    --combobox-item-font-size: var(--text-xs);
    --combobox-item-padding-y: var(--space-1);
    --combobox-item-icon-size: var(--space-3);
  }

  :host([size="sm"]) {
    --combobox-item-font-size: var(--text-xs);
    --combobox-item-padding-y: var(--space-1_5);
    --combobox-item-icon-size: var(--space-3_5);
  }

  :host([size="lg"]) {
    --combobox-item-font-size: var(--text-sm);
    --combobox-item-padding-y: var(--space-2);
    --combobox-item-icon-size: var(--space-4);
  }

  /* ---- Chips (multi-select container) ---- */

  .Chips {
    gap: var(--space-1);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-1) var(--space-8) var(--space-1) var(--space-1_5);
    min-height: var(--component-height-md);
    background: transparent;
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
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
  }

  :host([size="xs"]) .Input {
    height: var(--component-height-xs);
    font-size: var(--text-xs);
  }

  :host([size="xs"]) .Chips {
    min-height: var(--component-height-xs);
    border-radius: calc(var(--radius-md) * 0.8);
  }

  :host([size="xs"]) .InputWrapper .Input {
    min-height: var(--component-height-xs);
    padding: var(--space-1) var(--space-8) var(--space-1) var(--space-1_5);
    border-radius: calc(var(--radius-md) * 0.8);
  }

  :host([size="sm"]) .Input {
    height: var(--component-height-sm);
    font-size: var(--text-xs);
  }

  :host([size="sm"]) .Chips {
    min-height: var(--component-height-sm);
  }

  :host([size="sm"]) .InputWrapper .Input {
    min-height: var(--component-height-sm);
    padding: var(--space-1_5) var(--space-8) var(--space-1_5) var(--space-1_5);
  }

  :host([size="lg"]) .Input {
    height: var(--component-height-lg);
    font-size: var(--text-sm);
  }

  :host([size="lg"]) .Chips {
    min-height: var(--component-height-lg);
  }

  :host([size="lg"]) .InputWrapper .Input {
    min-height: var(--component-height-lg);
  }

  .Input::placeholder {
    color: var(--text-3);
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
    background: transparent;
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
    right: var(--space-2);
    color: var(--text-1);
  }

  :host([size="xs"]) .Arrow {
    --icon-size: var(--space-3);
  }

  :host([size="sm"]) .Arrow {
    --icon-size: var(--space-3_5);
  }

  :host([size="lg"]) .Arrow {
    --icon-size: var(--space-4);
    right: var(--space-3);
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
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
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

  /* ---- Popup (native top-layer [popover]) ---- */

  .Popup {
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    transform: translateY(calc(var(--space-1) * -1));
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .Popup:popover-open {
    transform: translateY(0);
  }

  @starting-style {
    .Popup:popover-open {
      transform: translateY(calc(var(--space-1) * -1));
    }
  }

  .List {
    padding: var(--space-1);
  }

  .Item {
    gap: var(--space-2);
    padding: var(--combobox-item-padding-y) var(--space-2)
      var(--combobox-item-padding-y) var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--combobox-item-font-size);
    line-height: var(--line-height-snug);
    font-family: var(--font-sans);
    color: var(--text-1);
  }

  .Item:hover,
  .Item[data-highlighted] {
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  .ItemIndicator {
    --icon-size: var(--combobox-item-icon-size);
  }

  .Empty {
    padding: var(--space-3);
    font-size: var(--combobox-item-font-size);
    line-height: var(--line-height-snug);
    color: var(--text-2);
    text-align: center;
  }
`;

export class DuiCombobox extends DuiComboboxPrimitive {
  static override styles = [...DuiComboboxPrimitive.styles, styles];
}

customElements.define(DuiCombobox.tagName, DuiCombobox);
