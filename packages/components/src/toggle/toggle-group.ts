import { css } from "lit";
import { DuiToggleGroupPrimitive } from "@dui/primitives/toggle";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-1);
    border-radius: var(--radius-md);
  }
`;

export class DuiToggleGroup extends DuiToggleGroupPrimitive {
  static override styles = [...DuiToggleGroupPrimitive.styles, styles];
}

customElements.define(DuiToggleGroup.tagName, DuiToggleGroup);
