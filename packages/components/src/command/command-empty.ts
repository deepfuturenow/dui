import { css } from "lit";
import { DuiCommandEmptyPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  .Empty {
    padding: var(--space-6);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    color: var(--text-2);
  }
`;

export class DuiCommandEmpty extends DuiCommandEmptyPrimitive {
  static override styles = [...DuiCommandEmptyPrimitive.styles, styles];
}

customElements.define(DuiCommandEmpty.tagName, DuiCommandEmpty);
