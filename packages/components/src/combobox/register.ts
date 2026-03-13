import { DuiCombobox } from "./combobox.ts";

if (!customElements.get(DuiCombobox.tagName)) {
  customElements.define(DuiCombobox.tagName, DuiCombobox);
}
