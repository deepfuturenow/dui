import { DuiDialog } from "./dialog.ts";
import { DuiDialogTrigger } from "./dialog-trigger.ts";
import { DuiDialogPopup } from "./dialog-popup.ts";
import { DuiDialogClose } from "./dialog-close.ts";

if (!customElements.get(DuiDialog.tagName)) {
  customElements.define(DuiDialog.tagName, DuiDialog);
}

if (!customElements.get(DuiDialogTrigger.tagName)) {
  customElements.define(DuiDialogTrigger.tagName, DuiDialogTrigger);
}

if (!customElements.get(DuiDialogPopup.tagName)) {
  customElements.define(DuiDialogPopup.tagName, DuiDialogPopup);
}

if (!customElements.get(DuiDialogClose.tagName)) {
  customElements.define(DuiDialogClose.tagName, DuiDialogClose);
}
