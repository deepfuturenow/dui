import { css } from "lit";
import { DuiStepperPrimitive } from "@dui/primitives/stepper";
import "../_install.ts";

const styles = css`
  [part="root"] {
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: transparent;
    transition-property: border-color, box-shadow;
    transition-duration: var(--duration-fast);
  }

  [part="root"]:focus-within {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }

  :host([aria-invalid="true"]) [part="root"] {
    border-color: var(--destructive);
  }

  [part="input"] {
    height: var(--component-height-md);
    width: var(--space-16);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-1);
  }

  :host([size="xs"]) [part="root"] {
    border-radius: calc(var(--radius-md) * 0.8);
  }

  :host([size="xs"]) [part="input"] {
    height: var(--component-height-xs);
    width: var(--space-12);
    font-size: var(--text-xs);
  }

  :host([size="sm"]) [part="input"] {
    height: var(--component-height-sm);
    width: var(--space-14);
    font-size: var(--text-xs);
  }

  :host([size="lg"]) [part="input"] {
    height: var(--component-height-lg);
  }

  [part="decrement"],
  [part="increment"] {
    width: var(--component-height-md);
    height: var(--component-height-md);
    color: var(--text-2);
    border-radius: var(--radius-sm);
    font-size: var(--text-lg);
    transition-property: background, color;
    transition-duration: var(--duration-fast);
  }

  /* Optically center the default −/+ glyphs. Flexbox centers their line box,
   * but the ink of these math symbols sits ~0.08em below the line-box center,
   * so nudge the slot up. Custom slotted content (icons) is already centered,
   * so cancel the nudge there. */
  [part="decrement"] slot,
  [part="increment"] slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-0.08em);
  }

  [part="decrement"] ::slotted(*),
  [part="increment"] ::slotted(*) {
    transform: translateY(0.08em);
  }

  :host([size="xs"]) [part="decrement"],
  :host([size="xs"]) [part="increment"] {
    width: var(--component-height-xs);
    height: var(--component-height-xs);
  }

  :host([size="sm"]) [part="decrement"],
  :host([size="sm"]) [part="increment"] {
    width: var(--component-height-sm);
    height: var(--component-height-sm);
  }

  :host([size="lg"]) [part="decrement"],
  :host([size="lg"]) [part="increment"] {
    width: var(--component-height-lg);
    height: var(--component-height-lg);
  }

  @media (hover: hover) {
    [part="decrement"]:hover:not(:disabled),
    [part="increment"]:hover:not(:disabled) {
      background: var(--surface-1);
      color: var(--text-1);
    }
  }

  [part="decrement"]:disabled,
  [part="increment"]:disabled {
    opacity: 0.4;
  }
`;

export class DuiStepper extends DuiStepperPrimitive {
  static override styles = [...DuiStepperPrimitive.styles, styles];
}

customElements.define(DuiStepper.tagName, DuiStepper);
