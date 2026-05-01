import { css } from "lit";
import { DuiToastClosePrimitive } from "@dui/primitives/toast";
import "../_install.ts";

const styles = css`
  /* Style any slotted <button> as a small ghost-icon close affordance.
    Hover-to-show behavior lives on the parent <dui-toast> (close-wrapper
    part); this just renders the button itself. */
  ::slotted(button) {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    line-height: 1;
    width: var(--space-5);
    height: var(--space-5);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-2);
    cursor: pointer;
    transition:
      background var(--duration-fast) var(--ease-out-3),
      color var(--duration-fast) var(--ease-out-3);
    }

    ::slotted(button:hover) {
      background: oklch(from var(--foreground) l c h / 0.08);
      color: var(--text-1);
    }

    ::slotted(button:focus-visible) {
      outline: var(--focus-ring-width) solid var(--focus-ring-color);
      outline-offset: var(--focus-ring-offset);
    }
  `;

  /**
   * `<dui-toast-close>` — Styled close button wrapper.
   *
   * Wraps a slotted close control (typically an auto-created `<button>×</button>`
   * from the imperative `toast()` facade, or a consumer-provided one). Clicking
   * dismisses the toast with reason `"close"` (handled by the primitive).
   *
   * Bare `<button>` children are styled as a square ghost-icon button. The
   * parent `<dui-toast>` controls visibility (hover-only on devices with
   * hover, always visible on touch).
   */
  export class DuiToastClose extends DuiToastClosePrimitive {
    static override styles = [...DuiToastClosePrimitive.styles, styles];
  }

  customElements.define(DuiToastClose.tagName, DuiToastClose);
