import { DuiPreviewCard } from "./preview-card.ts";
import { DuiPreviewCardTrigger } from "./preview-card-trigger.ts";
import { DuiPreviewCardPopup } from "./preview-card-popup.ts";

if (!customElements.get(DuiPreviewCard.tagName)) {
  customElements.define(DuiPreviewCard.tagName, DuiPreviewCard);
}

if (!customElements.get(DuiPreviewCardTrigger.tagName)) {
  customElements.define(DuiPreviewCardTrigger.tagName, DuiPreviewCardTrigger);
}

if (!customElements.get(DuiPreviewCardPopup.tagName)) {
  customElements.define(DuiPreviewCardPopup.tagName, DuiPreviewCardPopup);
}
