import { css } from "lit";
import { DuiSidebarContentPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css``;

export class DuiSidebarContent extends DuiSidebarContentPrimitive {
  static override styles = [...DuiSidebarContentPrimitive.styles, styles];
}

customElements.define(DuiSidebarContent.tagName, DuiSidebarContent);
