import { css } from "lit";
import { DuiSidebarHeaderPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css`
  :host {
    margin-bottom: var(--sidebar-header-content-gap);
  }
`;

export class DuiSidebarHeader extends DuiSidebarHeaderPrimitive {
  static override styles = [...DuiSidebarHeaderPrimitive.styles, styles];
}

customElements.define(DuiSidebarHeader.tagName, DuiSidebarHeader);
