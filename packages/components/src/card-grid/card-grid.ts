import { css } from "lit";
import { DuiCardGridPrimitive } from "@dui/primitives/card-grid";
import "../_install.ts";

const styles = css`
  [part="root"] {
    gap: var(--space-4);
  }
`;

export class DuiCardGrid extends DuiCardGridPrimitive {
  static override styles = [...DuiCardGridPrimitive.styles, styles];
}

customElements.define(DuiCardGrid.tagName, DuiCardGrid);
