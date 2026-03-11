import { DuiSwitch } from "./index.ts";

if (!customElements.get(DuiSwitch.tagName)) {
  customElements.define(DuiSwitch.tagName, DuiSwitch);
}
