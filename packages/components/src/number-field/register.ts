import { DuiNumberField } from "./index.ts";

if (!customElements.get(DuiNumberField.tagName)) {
  customElements.define(DuiNumberField.tagName, DuiNumberField);
}
