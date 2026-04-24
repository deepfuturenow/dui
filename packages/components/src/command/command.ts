import { css } from "lit";
import { DuiCommandPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  :host {
    border-radius: var(--radius-md);
    background: var(--surface-3);
    color: var(--text-1);
  }
`;

export class DuiCommand extends DuiCommandPrimitive {
  static override styles = [...DuiCommandPrimitive.styles, styles];
}

customElements.define(DuiCommand.tagName, DuiCommand);
