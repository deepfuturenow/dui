import { css } from "lit";
import { DuiSidebarFooterPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css``;

export class DuiSidebarFooter extends DuiSidebarFooterPrimitive {
  static override styles = [...DuiSidebarFooterPrimitive.styles, styles];
}

customElements.define(DuiSidebarFooter.tagName, DuiSidebarFooter);
