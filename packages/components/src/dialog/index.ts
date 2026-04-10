import { DuiDialog, openChangeEvent } from "./dialog.ts";
export { DuiDialog, openChangeEvent };
export type { DialogOpenChangeDetail } from "./dialog.ts";
import { DuiDialogTrigger } from "./dialog-trigger.ts";
export { DuiDialogTrigger };
import { DuiDialogPopup } from "./dialog-popup.ts";
export { DuiDialogPopup };
import { DuiDialogClose } from "./dialog-close.ts";
export { DuiDialogClose };
export type { DialogContext } from "./dialog-context.ts";

export const dialogFamily = [DuiDialog, DuiDialogTrigger, DuiDialogPopup, DuiDialogClose];
