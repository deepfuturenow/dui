import { css } from "lit";
import { DuiSeparatorPrimitive } from "@dui/primitives/separator";
import "../_install.ts";

const styles = css`
  :host {
    --separator-margin: 0;
  }

  [part="root"] {
    border: none;
  }

  :host([orientation="horizontal"]) [part="root"] {
    height: 0;
    border-top: var(--border-width-thin) solid var(--border);
    margin-top: var(--separator-margin);
    margin-bottom: var(--separator-margin);
  }

  :host([orientation="vertical"]) [part="root"] {
    width: 0;
    height: 100%;
    border-left: var(--border-width-thin) solid var(--border);
    margin-left: var(--separator-margin);
    margin-right: var(--separator-margin);
  }
`;

export class DuiSeparator extends DuiSeparatorPrimitive {
  static override styles = [...DuiSeparatorPrimitive.styles, styles];
}

customElements.define(DuiSeparator.tagName, DuiSeparator);
