import { css } from "lit";
import { DuiToastActionPrimitive } from "@dui/primitives/toast";
import "../_install.ts";

const styles = css`
  /* Style any slotted <button> uniformly — works for both the imperative
    facade's auto-created <button>s and consumer-slotted ones. Native
    ::slotted() can't reach into shadow trees, but this targets light-DOM
    children of <dui-toast-action>. */
  ::slotted(button) {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    line-height: 1;
    padding: var(--space-1_5) var(--space-2_5);
    border: var(--border-width-thin) solid transparent;
    border-radius: var(--radius-sm);
    background: var(--foreground);
    color: var(--background);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out-3),
      filter var(--duration-fast) var(--ease-out-3);
    }

    ::slotted(button:hover) {
      filter: brightness(0.88);
    }

    ::slotted(button:active) {
      filter: brightness(0.78);
    }

    ::slotted(button:focus-visible) {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: var(--focus-ring-offset);
    }
  `;

  /**
   * `<dui-toast-action>` — Styled action button wrapper.
   *
   * Wraps a slotted button (typically an auto-created `<button>` from the
   * imperative `toast()` facade, or a consumer-provided `<button>` /
   * `<dui-button>`). Clicking the slotted control dismisses the toast with
   * reason `"action"` (handled by the primitive).
   *
   * Bare `<button>` children are styled as a small filled neutral button.
   * Slotted `<dui-button>` retains its own styling.
   */
  export class DuiToastAction extends DuiToastActionPrimitive {
    static override styles = [...DuiToastActionPrimitive.styles, styles];
  }

  customElements.define(DuiToastAction.tagName, DuiToastAction);
