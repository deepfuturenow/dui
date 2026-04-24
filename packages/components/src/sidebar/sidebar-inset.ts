import { css } from "lit";
import { DuiSidebarInsetPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css``;

export class DuiSidebarInset extends DuiSidebarInsetPrimitive {
  static override styles = [...DuiSidebarInsetPrimitive.styles, styles];
}

customElements.define(DuiSidebarInset.tagName, DuiSidebarInset);
