import { css } from "lit";
import { DuiTooltipPrimitive } from "@dui/primitives/tooltip";
import "../_install.ts";

const styles = css``;

export class DuiTooltip extends DuiTooltipPrimitive {
  static override styles = [...DuiTooltipPrimitive.styles, styles];
}

customElements.define(DuiTooltip.tagName, DuiTooltip);
