import { css } from "lit";
import { DuiMenuPrimitive } from "@dui/primitives/menu";
import "../_install.ts";

const styles = css`
  /* ---------------------------------------------------------------
   * Sizes. Items stay slotted in the menu's light DOM, so these vars
   * set on the host inherit to each <dui-menu-item> directly. md is the
   * implicit default (fallbacks live in menu-item.ts's var() consumption).
   * Scales item density: height / font-size / icon-size.
   * --------------------------------------------------------------- */

  :host([size="xs"]) {
    --menu-item-height: var(--component-height-xs);
    --menu-item-font-size: var(--text-xs);
    --menu-item-icon-size: var(--space-3_5);
  }

  :host([size="sm"]) {
    --menu-item-height: var(--component-height-sm);
    --menu-item-font-size: var(--text-xs);
    --menu-item-icon-size: var(--space-4);
  }

  :host([size="lg"]) {
    --menu-item-height: var(--component-height-lg);
    --menu-item-font-size: var(--text-sm);
    --menu-item-icon-size: var(--space-4_5);
  }

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

  .Menu {
    padding: var(--space-1);
  }

  .Menu dui-separator {
    margin: var(--space-1) var(--space-2);
  }
`;

export class DuiMenu extends DuiMenuPrimitive {
  static override styles = [...DuiMenuPrimitive.styles, styles];
}

customElements.define(DuiMenu.tagName, DuiMenu);
