import { css } from "lit";
import { DuiCommandInputPrimitive } from "@dui/primitives/command";
import "../_install.ts";

const styles = css`
  .InputWrapper {
    gap: var(--space-2);
    border-bottom: var(--border-width-thin) solid var(--border);
    padding-inline: var(--space-3);
  }

  .SearchIcon {
    color: var(--text-2);
    width: var(--space-4);
    height: var(--space-4);
  }

  .Input {
    height: var(--component-height-md);
    border-radius: var(--radius-md);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
  }

  .Input::placeholder {
    color: var(--text-3);
  }
`;

export class DuiCommandInput extends DuiCommandInputPrimitive {
  static override styles = [...DuiCommandInputPrimitive.styles, styles];
}

customElements.define(DuiCommandInput.tagName, DuiCommandInput);
