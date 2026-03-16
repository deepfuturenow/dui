import { DuiAlertDialog } from "./alert-dialog.ts";
import { DuiAlertDialogTrigger } from "./alert-dialog-trigger.ts";
import { DuiAlertDialogPopup } from "./alert-dialog-popup.ts";
import { DuiAlertDialogClose } from "./alert-dialog-close.ts";

if (!customElements.get(DuiAlertDialog.tagName)) {
  customElements.define(DuiAlertDialog.tagName, DuiAlertDialog);
}

if (!customElements.get(DuiAlertDialogTrigger.tagName)) {
  customElements.define(DuiAlertDialogTrigger.tagName, DuiAlertDialogTrigger);
}

if (!customElements.get(DuiAlertDialogPopup.tagName)) {
  customElements.define(DuiAlertDialogPopup.tagName, DuiAlertDialogPopup);
}

if (!customElements.get(DuiAlertDialogClose.tagName)) {
  customElements.define(DuiAlertDialogClose.tagName, DuiAlertDialogClose);
}
