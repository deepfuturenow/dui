import { DuiSelect } from "./select.ts";

if (!customElements.get(DuiSelect.tagName)) {
  customElements.define(DuiSelect.tagName, DuiSelect);
}
