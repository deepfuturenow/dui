import { DuiPopover } from "./popover.ts";
import { DuiPopoverTrigger } from "./popover-trigger.ts";
import { DuiPopoverPopup } from "./popover-popup.ts";
import { DuiPopoverClose } from "./popover-close.ts";

if (!customElements.get(DuiPopover.tagName)) {
  customElements.define(DuiPopover.tagName, DuiPopover);
}

if (!customElements.get(DuiPopoverTrigger.tagName)) {
  customElements.define(DuiPopoverTrigger.tagName, DuiPopoverTrigger);
}

if (!customElements.get(DuiPopoverPopup.tagName)) {
  customElements.define(DuiPopoverPopup.tagName, DuiPopoverPopup);
}

if (!customElements.get(DuiPopoverClose.tagName)) {
  customElements.define(DuiPopoverClose.tagName, DuiPopoverClose);
}
