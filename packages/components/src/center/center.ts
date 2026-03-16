/** Ported from original DUI: deep-future-app/app/client/components/dui/center */

import { css, html, LitElement, type TemplateResult } from "lit";
import { base } from "@dui/core/base";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
    min-height: 100cqh;
    width: 100cqw;
  }

  [part="root"] {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100cqh;
    width: 100cqw;
  }
`;

/**
 * `<dui-center>` — Centers content horizontally and vertically
 * within its container query dimensions.
 *
 * @slot - Content to center.
 * @csspart root - The centering container element.
 */
export class DuiCenter extends LitElement {
  static tagName = "dui-center" as const;

  static override styles = [base, styles];

  override render(): TemplateResult {
    return html`
      <div part="root">
        <slot></slot>
      </div>
    `;
  }
}
