import { css } from "lit";
import { DuiCheckboxPrimitive } from "@dui/primitives/checkbox";
import "../_install.ts";

const styles = css`
  :host {
    --checkbox-size: var(--space-4_5);
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  [part="root"] {
    width: var(--checkbox-size);
    height: var(--checkbox-size);
    margin-block-start: calc(
      (var(--line-height-normal) * 1em - var(--checkbox-size)) / 2
    );
    border-radius: var(--radius-sm);
    transition-property: background, border-color, box-shadow, filter, transform;
    transition-duration: var(--duration-fast);
  }

  [part="root"][data-unchecked] {
    border: var(--border-width-thin) solid var(--border);
    background: transparent;
  }

  [part="root"][data-checked],
  [part="root"][data-indeterminate] {
    background: var(--accent);
    border: var(--border-width-thin) solid var(--accent);
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

  :host([aria-invalid="true"]) [part="root"] {
    background: color-mix(in oklch, var(--destructive) 15%, transparent);
    border-color: color-mix(in oklch, var(--destructive) 70%, transparent);
  }

  [part="indicator"] {
    color: oklch(from var(--accent) 0.98 0.01 h);
  }

  .Icon {
    width: var(--space-3);
    height: var(--space-3);
  }
`;

export class DuiCheckbox extends DuiCheckboxPrimitive {
  static override styles = [...DuiCheckboxPrimitive.styles, styles];
}

customElements.define(DuiCheckbox.tagName, DuiCheckbox);
