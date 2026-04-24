import { css } from "lit";
import { DuiCommandListPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  dui-scroll-area {
    max-height: calc(var(--space-5) * 15);
    height: auto;
  }

  .List {
    padding: var(--space-1) 0;
  }
`;

export class DuiCommandList extends DuiCommandListPrimitive {
  static override styles = [...DuiCommandListPrimitive.styles, styles];
}

customElements.define(DuiCommandList.tagName, DuiCommandList);
