import { DuiToggle } from "./toggle.ts";
import { DuiToggleGroup } from "./toggle-group.ts";

if (!customElements.get(DuiToggle.tagName)) {
  customElements.define(DuiToggle.tagName, DuiToggle);
}

if (!customElements.get(DuiToggleGroup.tagName)) {
  customElements.define(DuiToggleGroup.tagName, DuiToggleGroup);
}
