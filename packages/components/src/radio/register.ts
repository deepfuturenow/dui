import { DuiRadio } from "./radio.ts";
import { DuiRadioGroup } from "./radio-group.ts";

if (!customElements.get(DuiRadio.tagName)) {
  customElements.define(DuiRadio.tagName, DuiRadio);
}
if (!customElements.get(DuiRadioGroup.tagName)) {
  customElements.define(DuiRadioGroup.tagName, DuiRadioGroup);
}
