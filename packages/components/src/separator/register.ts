import { DuiSeparator } from "./index.ts";

if (!customElements.get(DuiSeparator.tagName)) {
  customElements.define(DuiSeparator.tagName, DuiSeparator);
}
