import { css } from "lit";
import { DuiSidebarMenuPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css`
  .Menu {
    gap: var(--space-px);
  }
`;

export class DuiSidebarMenu extends DuiSidebarMenuPrimitive {
  static override styles = [...DuiSidebarMenuPrimitive.styles, styles];
}

customElements.define(DuiSidebarMenu.tagName, DuiSidebarMenu);
