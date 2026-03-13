import { DuiScrollArea } from "./scroll-area.ts";

if (!customElements.get(DuiScrollArea.tagName)) {
  customElements.define(DuiScrollArea.tagName, DuiScrollArea);
}
