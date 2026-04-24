import { css } from "lit";
import { DuiCheckboxGroupPrimitive } from "@dui/primitives/checkbox";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-1);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }
`;

export class DuiCheckboxGroup extends DuiCheckboxGroupPrimitive {
  static override styles = [...DuiCheckboxGroupPrimitive.styles, styles];
}

customElements.define(DuiCheckboxGroup.tagName, DuiCheckboxGroup);
