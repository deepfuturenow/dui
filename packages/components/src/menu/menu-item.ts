import { css } from "lit";
import { DuiMenuItemPrimitive } from "@dui/primitives/menu";
import "../_install.ts";

const styles = css`
  .Item {
    --icon-size: var(--space-4);
    --icon-color: var(--text-2);
    gap: var(--space-2);
    padding: 0 var(--space-2);
    height: var(--component-height-sm);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    text-box: trim-both cap alphabetic;
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
