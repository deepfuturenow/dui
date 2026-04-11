/** Ported from original DUI: deep-future-app/app/client/components/dui/page-inset */

import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
    --page-inset-pad-x: var(--space-16);
    --page-inset-pad-y: var(--space-12);
    --page-inset-max-width: 48rem;
    --page-inset-min-width: auto;
  }

  [part="root"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--page-inset-pad-y) var(--page-inset-pad-x);
    min-height: 100cqh;
    max-width: 100cqw;
  }

  [part="inner"] {
    max-width: var(--page-inset-max-width);
    min-width: var(--page-inset-min-width);
    width: 100%;
  }
`;

/**
 * `<dui-page-inset>` — Centers content with max-width constraints and configurable padding.
 *
 * @slot - Content to be centered within the inset area.
 * @csspart root - The outer container element.
 * @csspart inner - The inner content wrapper with max-width constraint.
 * @cssprop --page-inset-pad-x - Horizontal padding (default: var(--space-16)).
 * @cssprop --page-inset-pad-y - Vertical padding (default: var(--space-12)).
 * @cssprop --page-inset-max-width - Max width of inner content (default: 48rem).
 * @cssprop --page-inset-min-width - Min width of inner content (default: auto).
 */
export class DuiPageInset extends LitElement {
  static tagName = "dui-page-inset" as const;

  static override styles = [base, styles];

  /** Maximum width of the inner content area. Overrides --page-inset-max-width. */
  @property({ attribute: "max-width" })
  accessor maxWidth: string | undefined;

  /** Minimum width of the inner content area. Overrides --page-inset-min-width. */
  @property({ attribute: "min-width" })
  accessor minWidth: string | undefined;

  /** Horizontal padding. Overrides --page-inset-pad-x. */
  @property({ attribute: "pad-x" })
  accessor padX: string | undefined;

  /** Vertical padding. Overrides --page-inset-pad-y. */
  @property({ attribute: "pad-y" })
  accessor padY: string | undefined;

  #setOrRemove(prop: string, value: string | undefined): void {
    if (value) this.style.setProperty(prop, value);
    else this.style.removeProperty(prop);
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("maxWidth"))
      this.#setOrRemove("--page-inset-max-width", this.maxWidth);
    if (changed.has("minWidth"))
      this.#setOrRemove("--page-inset-min-width", this.minWidth);
    if (changed.has("padX")) this.#setOrRemove("--page-inset-pad-x", this.padX);
    if (changed.has("padY")) this.#setOrRemove("--page-inset-pad-y", this.padY);
  }

  override render(): TemplateResult {
    return html`
      <div part="root">
        <div part="inner">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
