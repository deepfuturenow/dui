import { DuiInput } from "./index.ts";

if (!customElements.get(DuiInput.tagName)) {
  customElements.define(DuiInput.tagName, DuiInput);
}
