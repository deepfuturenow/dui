import { DuiTooltip } from "./tooltip.ts";
import { DuiTooltipTrigger } from "./tooltip-trigger.ts";
import { DuiTooltipPopup } from "./tooltip-popup.ts";

if (!customElements.get(DuiTooltip.tagName)) {
  customElements.define(DuiTooltip.tagName, DuiTooltip);
}

if (!customElements.get(DuiTooltipTrigger.tagName)) {
  customElements.define(DuiTooltipTrigger.tagName, DuiTooltipTrigger);
}

if (!customElements.get(DuiTooltipPopup.tagName)) {
  customElements.define(DuiTooltipPopup.tagName, DuiTooltipPopup);
}
