import { DuiMenubar } from "./index.ts";

if (!customElements.get(DuiMenubar.tagName)) {
  customElements.define(DuiMenubar.tagName, DuiMenubar);
}
