import { DuiCollapsible } from "./collapsible.ts";

if (!customElements.get(DuiCollapsible.tagName)) {
  customElements.define(DuiCollapsible.tagName, DuiCollapsible);
}
