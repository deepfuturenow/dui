import { DuiCenter } from "./index.ts";

if (!customElements.get(DuiCenter.tagName)) {
  customElements.define(DuiCenter.tagName, DuiCenter);
}
