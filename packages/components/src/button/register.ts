import { DuiButton } from "./index.ts";

if (!customElements.get(DuiButton.tagName)) {
  customElements.define(DuiButton.tagName, DuiButton);
}
