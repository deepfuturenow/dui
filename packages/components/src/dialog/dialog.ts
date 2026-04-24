import { css } from "lit";
import { DuiDialogPrimitive } from "@dui/primitives/dialog";
import "../_install.ts";

const styles = css``;

export class DuiDialog extends DuiDialogPrimitive {
  static override styles = [...DuiDialogPrimitive.styles, styles];
}

customElements.define(DuiDialog.tagName, DuiDialog);
