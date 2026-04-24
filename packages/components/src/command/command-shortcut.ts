import { css } from "lit";
import { DuiCommandShortcutPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  .Shortcut {
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    color: var(--text-2);
  }
`;

export class DuiCommandShortcut extends DuiCommandShortcutPrimitive {
  static override styles = [...DuiCommandShortcutPrimitive.styles, styles];
}

customElements.define(DuiCommandShortcut.tagName, DuiCommandShortcut);
