import { DuiToolbar } from "./toolbar.ts";

if (!customElements.get(DuiToolbar.tagName)) {
  customElements.define(DuiToolbar.tagName, DuiToolbar);
}
