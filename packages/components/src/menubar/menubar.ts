import { css } from "lit";
import { DuiMenubarPrimitive } from "@dui/primitives/menubar";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-1);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--background);
    padding: var(--space-1);
  }
`;

export class DuiMenubar extends DuiMenubarPrimitive {
  static override styles = [...DuiMenubarPrimitive.styles, styles];
}

customElements.define(DuiMenubar.tagName, DuiMenubar);
