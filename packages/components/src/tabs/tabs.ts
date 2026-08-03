import { css } from "lit";
import { DuiTabsPrimitive } from "@dui/primitives/tabs";
import "../_install.ts";

const styles = css`
  /* ---------------------------------------------------------------
   * Sizes. <dui-tab> is a light-DOM child, so these inheritable vars
   * cascade into each tab's shadow root. md is the implicit default
   * (the fallback lives in tab.ts's var() consumption). Per spec only
   * the tab-trigger height + font scale — the indicator stays fixed.
   * --------------------------------------------------------------- */

  :host([size="xs"]) {
    --tab-height: var(--component-height-xs);
    --tab-font-size: var(--text-xs);
  }

  :host([size="sm"]) {
    --tab-height: var(--component-height-sm);
    --tab-font-size: var(--text-xs);
  }

  :host([size="lg"]) {
    --tab-height: var(--component-height-lg);
    --tab-font-size: var(--text-sm);
  }
`;

export class DuiTabs extends DuiTabsPrimitive {
  static override styles = [...DuiTabsPrimitive.styles, styles];
}

customElements.define(DuiTabs.tagName, DuiTabs);
