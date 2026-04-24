import { css } from "lit";
import { DuiAlertDialogPrimitive } from "@dui/primitives/alert-dialog";
import "../_install.ts";

const styles = css``;

export class DuiAlertDialog extends DuiAlertDialogPrimitive {
  static override styles = [...DuiAlertDialogPrimitive.styles, styles];
}

customElements.define(DuiAlertDialog.tagName, DuiAlertDialog);
