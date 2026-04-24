import { css } from "lit";
import { DuiSidebarSeparatorPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css`
  .Separator {
    height: var(--border-width-thin);
    margin: var(--space-2) var(--space-2);
    background: var(--sidebar-separator);
  }
`;

export class DuiSidebarSeparator extends DuiSidebarSeparatorPrimitive {
  static override styles = [...DuiSidebarSeparatorPrimitive.styles, styles];
}

customElements.define(DuiSidebarSeparator.tagName, DuiSidebarSeparator);
