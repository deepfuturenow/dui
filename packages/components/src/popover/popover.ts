import { css } from "lit";
import { DuiPopoverPrimitive } from "@dui/primitives/popover";
import "../_install.ts";

const styles = css``;

export class DuiPopover extends DuiPopoverPrimitive {
  static override styles = [...DuiPopoverPrimitive.styles, styles];
}

customElements.define(DuiPopover.tagName, DuiPopover);
