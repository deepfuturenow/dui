import { DuiPageInset } from "./index.ts";

if (!customElements.get(DuiPageInset.tagName)) {
  customElements.define(DuiPageInset.tagName, DuiPageInset);
}
