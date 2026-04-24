import { css } from "lit";
import { DuiFieldsetPrimitive } from "@dui/primitives/fieldset";
import "../_install.ts";

const styles = css`
  [part="root"] {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  [part="root"][data-disabled] {
    opacity: 0.4;
  }

  [part="legend"] {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-normal);
    color: var(--text-1);
    margin-bottom: var(--space-2);
  }
`;

export class DuiFieldset extends DuiFieldsetPrimitive {
  static override styles = [...DuiFieldsetPrimitive.styles, styles];
}

customElements.define(DuiFieldset.tagName, DuiFieldset);
