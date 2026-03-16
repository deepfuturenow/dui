import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./create-preview.ts";

@customElement("docs-page-create")
export class DocsPageCreate extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }
  `;

  override render() {
    return html`<create-preview></create-preview>`;
  }
}
