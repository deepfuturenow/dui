/** Ported from original DUI: deep-future-app/app/client/components/dui/link */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export const spaNavigateEvent = customEvent<{ href: string }>(
  "spa-navigate",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: contents;
  }

  a {
    display: contents;
    color: inherit;
    text-decoration: none;
  }
`;

/**
 * `<dui-link>` — A layout-transparent SPA link.
 *
 * Renders a real `<a href>` inside shadow DOM for native link behaviors
 * (right-click menu, URL preview on hover, accessibility). On plain
 * left-click, dispatches a bubbling `spa-navigate` event instead of
 * performing a full page navigation. Modifier-clicks (cmd/ctrl/shift/middle)
 * fall through to the browser for new-tab behavior.
 *
 * @slot - Link content.
 * @fires spa-navigate - Fired on plain left-click. Detail: { href }.
 */
export class DuiLink extends LitElement {
  static tagName = "dui-link" as const;

  static override styles = [base, styles];

  /** The URL to navigate to. */
  @property()
  accessor href = "";

  #onClick = (event: MouseEvent): void => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    this.dispatchEvent(spaNavigateEvent({ href: this.href }));
  };

  override render(): TemplateResult {
    return html`<a href="${this.href}" @click="${this.#onClick}"><slot></slot></a>`;
  }
}
