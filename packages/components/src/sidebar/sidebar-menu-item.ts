import { css } from "lit";
import { DuiSidebarMenuItemPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css``;

export class DuiSidebarMenuItem extends DuiSidebarMenuItemPrimitive {
  static override styles = [...DuiSidebarMenuItemPrimitive.styles, styles];
}

customElements.define(DuiSidebarMenuItem.tagName, DuiSidebarMenuItem);
