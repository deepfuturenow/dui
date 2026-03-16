import { DuiPortal } from "./index.ts";

if (!customElements.get(DuiPortal.tagName)) {
  customElements.define(DuiPortal.tagName, DuiPortal);
}
