import { css } from "lit";
import { DuiAccordionPrimitive } from "@dui/primitives/accordion";
import "../_install.ts";

const styles = css`
  ::slotted(:last-child) {
    --accordion-item-border: none;
  }
`;

export class DuiAccordion extends DuiAccordionPrimitive {
  static override styles = [...DuiAccordionPrimitive.styles, styles];
}

customElements.define(DuiAccordion.tagName, DuiAccordion);
