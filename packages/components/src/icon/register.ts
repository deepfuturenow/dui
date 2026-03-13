import { DuiIcon } from "./icon.ts";

if (!customElements.get(DuiIcon.tagName)) {
  customElements.define(DuiIcon.tagName, DuiIcon);
}
