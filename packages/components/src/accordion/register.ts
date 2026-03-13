import { DuiAccordion } from "./accordion.ts";
import { DuiAccordionItem } from "./accordion-item.ts";

if (!customElements.get(DuiAccordion.tagName)) {
  customElements.define(DuiAccordion.tagName, DuiAccordion);
}

if (!customElements.get(DuiAccordionItem.tagName)) {
  customElements.define(DuiAccordionItem.tagName, DuiAccordionItem);
}
