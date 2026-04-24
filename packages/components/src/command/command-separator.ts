import { css } from "lit";
import { DuiCommandSeparatorPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  .Separator {
    height: var(--border-width-thin);
    margin-inline: calc(-1 * var(--space-1));
    background: var(--border);
  }
`;

export class DuiCommandSeparator extends DuiCommandSeparatorPrimitive {
  static override styles = [...DuiCommandSeparatorPrimitive.styles, styles];
}

customElements.define(DuiCommandSeparator.tagName, DuiCommandSeparator);
