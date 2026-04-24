import { css } from "lit";
import { DuiCommandGroupPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  .Group {
    padding: var(--space-1_5);
  }

  .Heading {
    padding: var(--space-1_5) var(--space-2);
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    font-weight: var(--font-weight-medium);
    color: var(--text-2);
  }
`;

export class DuiCommandGroup extends DuiCommandGroupPrimitive {
  static override styles = [...DuiCommandGroupPrimitive.styles, styles];
}

customElements.define(DuiCommandGroup.tagName, DuiCommandGroup);
