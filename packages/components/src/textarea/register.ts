import { DuiTextarea } from "./textarea.ts";

if (!customElements.get(DuiTextarea.tagName)) {
  customElements.define(DuiTextarea.tagName, DuiTextarea);
}
