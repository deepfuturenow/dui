import { css } from "lit";
import { DuiMenuPrimitive } from "@dui/primitives/menu";
import "../_install.ts";

const styles = css`
  /* ---------------------------------------------------------------
   * Sizes. Menu items are relocated into the portal, so these vars are
   * forwarded onto the positioner by the primitive (forwardProperties)
   * and inherited by each <dui-menu-item>. md is the implicit default
   * (fallbacks live in menu-item.ts's var() consumption). Scales item
   * density: height / font-size / icon-size.
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
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .Popup[data-starting-style],
  .Popup[data-ending-style] {
    transform: translateY(calc(var(--space-1) * -1));
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
