import { css } from "lit";
import { DuiTruncPrimitive } from "@dui/primitives/trunc";
import "../_install.ts";

const styles = css`
  [part="root"] {
    font-family: var(--font-sans);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    color: var(--text-1);
  }
`;

export class DuiTrunc extends DuiTruncPrimitive {
  static override styles = [...DuiTruncPrimitive.styles, styles];
}

customElements.define(DuiTrunc.tagName, DuiTrunc);
