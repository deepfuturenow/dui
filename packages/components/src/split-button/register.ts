import { DuiSplitButton } from "./index.ts";

if (!customElements.get(DuiSplitButton.tagName)) {
  customElements.define(DuiSplitButton.tagName, DuiSplitButton);
}
