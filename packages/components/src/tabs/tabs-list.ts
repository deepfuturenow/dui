import { css } from "lit";
import { DuiTabsListPrimitive } from "@dui/primitives/tabs";
import "../_install.ts";

const styles = css`
  :host {
    --tabs-list-justify: start;
  }

  [part="list"] {
    justify-content: var(--tabs-list-justify);
    padding-inline: 0;
    gap: 0;
  }

  [part="list"][data-orientation="vertical"] {
    box-shadow: inset -1px 0 var(--border);
    padding-inline: 0;
    padding-block: var(--space-1);
  }
`;

export class DuiTabsList extends DuiTabsListPrimitive {
  static override styles = [...DuiTabsListPrimitive.styles, styles];
}

customElements.define(DuiTabsList.tagName, DuiTabsList);
