import { css } from "lit";
import { DuiSidebarTriggerPrimitive } from "@dui/primitives/sidebar";
import "../_install.ts";

const styles = css`
  dui-button {
    --button-width: var(--button-height);
    --button-padding-x: 0;
    --button-gap: 0;
  }
`;

export class DuiSidebarTrigger extends DuiSidebarTriggerPrimitive {
  static override styles = [...DuiSidebarTriggerPrimitive.styles, styles];
}

customElements.define(DuiSidebarTrigger.tagName, DuiSidebarTrigger);
