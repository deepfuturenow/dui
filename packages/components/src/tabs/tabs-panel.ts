/** Ported from original DUI: deep-future-app/app/client/components/dui/tabs */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { type TabsContext, tabsContext } from "./tabs-context.ts";

const styles = css`
  :host {
    display: block;
  }

  :host([data-hidden]) {
    display: none;
  }

  [part="panel"] {
    position: relative;
    outline: 0;
  }

  [part="panel"][hidden] {
    display: none;
  }
`;

/**
 * Content panel for a tab. Shown when the matching tab is active.
 */
export class DuiTabsPanel extends LitElement {
  static tagName = "dui-tabs-panel" as const;
  static override styles = [base, styles];

  /** Panel value — must match the corresponding tab's value. */
  @property()
  accessor value = "";

  /** Keep panel in DOM when not active. */
  @property({ type: Boolean, attribute: "keep-mounted" })
  accessor keepMounted = false;

  @consume({ context: tabsContext, subscribe: true })
  accessor _ctx!: TabsContext;

  get #isActive(): boolean {
    return this._ctx?.value === this.value;
  }

  override willUpdate(): void {
    if (this.#isActive) {
      this.removeAttribute("data-hidden");
    } else {
      this.setAttribute("data-hidden", "");
    }
  }

  override render(): TemplateResult | typeof nothing {
    const isActive = this.#isActive;

    if (!isActive && !this.keepMounted) {
      return nothing;
    }

    return html`
      <div
        part="panel"
        role="tabpanel"
        ?hidden=${!isActive}
        tabindex="0"
      >
        <slot></slot>
      </div>
    `;
  }
}
