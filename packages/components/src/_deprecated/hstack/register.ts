import { DuiHstack } from "./index.ts";

if (!customElements.get(DuiHstack.tagName)) {
  customElements.define(DuiHstack.tagName, DuiHstack);
}
