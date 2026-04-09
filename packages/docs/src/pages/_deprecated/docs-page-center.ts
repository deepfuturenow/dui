import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-center")
export class DocsPageCenter extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-center">
        <dui-docs-demo label="Basic">
        <div style="height: 200px; border: 1px dashed var(--border); container-type: size;">
          <dui-center>
            <span>Centered content</span>
          </dui-center>
        </div>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
