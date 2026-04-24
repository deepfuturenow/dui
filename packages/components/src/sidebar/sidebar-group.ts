import { css } from "lit";
import { DuiSidebarGroupPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css`
  :host {
    padding: var(--sidebar-group-padding-y) 0;
  }
`;

export class DuiSidebarGroup extends DuiSidebarGroupPrimitive {
  static override styles = [...DuiSidebarGroupPrimitive.styles, styles];
}

customElements.define(DuiSidebarGroup.tagName, DuiSidebarGroup);
