import { css } from "lit";
import { DuiFieldPrimitive } from "@dui/primitives/field";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-2);
  }

  [part="root"][data-orientation="horizontal"] {
    gap: var(--space-3);
  }

  [part="label"] {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    line-height: var(--line-height-normal);
    color: var(--text-1);
  }

  [part="label"][data-disabled] {
    opacity: 0.4;
  }

  [part="description"] {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    line-height: var(--line-height-normal);
    color: var(--text-3);
    margin: 0;
  }

  [part="error"][data-invalid] {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    line-height: var(--line-height-normal);
    color: var(--destructive);
    margin: 0;
  }
`;

export class DuiField extends DuiFieldPrimitive {
  static override styles = [...DuiFieldPrimitive.styles, styles];
}

customElements.define(DuiField.tagName, DuiField);
