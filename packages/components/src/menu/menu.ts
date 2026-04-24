import { css } from "lit";
import { DuiMenuPrimitive } from "@dui/primitives/menu";
import "../_install.ts";

const styles = css`
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
