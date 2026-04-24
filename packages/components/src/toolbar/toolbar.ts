import { css } from "lit";
import { DuiToolbarPrimitive } from "@dui/primitives/toolbar";
import "../_install.ts";

const styles = css`
  /* ── Root ── */

  [part="root"] {
    column-gap: var(--space-2);
  }

  :host([inset]) [part="root"] {
    padding-top: var(--toolbar-padding-y, var(--space-2));
    padding-bottom: var(--toolbar-padding-y, var(--space-2));
    padding-left: var(--toolbar-padding-x, var(--space-4));
    padding-right: var(--toolbar-padding-x, var(--space-4));
  }

  :host([inset][has-button-left]) [part="root"] {
    padding-left: var(--toolbar-padding-x-button, var(--space-2));
  }

  :host([inset][has-button-right]) [part="root"] {
    padding-right: var(--toolbar-padding-x-button, var(--space-2));
  }

  /* ── Slot containers ── */

  [part="left"],
  [part="center"],
  [part="right"] {
    gap: var(--space-2);
  }
`;

export class DuiToolbar extends DuiToolbarPrimitive {
  static override styles = [...DuiToolbarPrimitive.styles, styles];
}

customElements.define(DuiToolbar.tagName, DuiToolbar);
