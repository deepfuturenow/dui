import { css } from "lit";
import { DuiRadioGroupPrimitive } from "@dui/primitives/radio";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-1_5);
  }
`;

export class DuiRadioGroup extends DuiRadioGroupPrimitive {
  static override styles = [...DuiRadioGroupPrimitive.styles, styles];
}

customElements.define(DuiRadioGroup.tagName, DuiRadioGroup);
