import { css, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/** Simple flex row for arranging demo items. */
@customElement("docs-row")
export class DocsRow extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      gap: var(--space-3, 0.75rem);
      align-items: center;
      flex-wrap: wrap;
    }
  `;

  override render() {
    return html`<slot></slot>`;
  }
}
