import { DuiVstack } from "./index.ts";

if (!customElements.get(DuiVstack.tagName)) {
  customElements.define(DuiVstack.tagName, DuiVstack);
}
