import { css } from "lit";
import { DuiMenuItemPrimitive } from "@dui/primitives/menu";
import "../_install.ts";

const styles = css`
  /* Height / font / icon read inheritable vars set by <dui-menu size=…>.
   * The menu-items are relocated into the popup's portal, so these vars
   * arrive via the primitive's forwardProperties (set on the positioner)
   * rather than DOM inheritance. md defaults live in the var() fallbacks
   * (NOT a :host declaration, which would shadow the forwarded value). */
  .Item {
    --icon-size: var(--menu-item-icon-size, var(--space-4_5));
    --icon-color: var(--text-2);
    gap: var(--space-2);
    padding: 0 var(--space-2);
    height: var(--menu-item-height, var(--component-height-md));
    border-radius: var(--radius-sm);
    font-size: var(--menu-item-font-size, var(--text-sm));
    line-height: var(--line-height-snug);
    font-family: var(--font-sans);
    color: var(--text-1);
  }

  .Item:hover,
  :host([data-highlighted]) .Item {
    --icon-color: var(--text-1);
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  :host([variant="danger"]) .Item {
    --icon-color: var(--destructive);
    color: var(--destructive);
  }

  :host([variant="danger"]) .Item:hover,
  :host([variant="danger"][data-highlighted]) .Item {
    --icon-color: oklch(from var(--destructive) 0.98 0.01 h);
    background: var(--destructive);
    color: oklch(from var(--destructive) 0.98 0.01 h);
  }

  :host([disabled]) .Item {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export class DuiMenuItem extends DuiMenuItemPrimitive {
  static override styles = [...DuiMenuItemPrimitive.styles, styles];
}

customElements.define(DuiMenuItem.tagName, DuiMenuItem);
