import { css } from "lit";
import { DuiPortalPrimitive } from "@dui/primitives/portal";
import "../_install.ts";

const styles = css``;

export class DuiPortal extends DuiPortalPrimitive {
  static override styles = [...DuiPortalPrimitive.styles, styles];
}

customElements.define(DuiPortal.tagName, DuiPortal);
