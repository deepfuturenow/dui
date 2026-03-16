import { DuiCheckbox } from "./checkbox.ts";
import { DuiCheckboxGroup } from "./checkbox-group.ts";

if (!customElements.get(DuiCheckbox.tagName)) {
  customElements.define(DuiCheckbox.tagName, DuiCheckbox);
}

if (!customElements.get(DuiCheckboxGroup.tagName)) {
  customElements.define(DuiCheckboxGroup.tagName, DuiCheckboxGroup);
}
