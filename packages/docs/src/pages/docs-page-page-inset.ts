import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-page-inset")
export class DocsPagePageInset extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-page-inset">
        <dui-docs-demo label="Default">
        <div style="border: 1px dashed var(--border); container-type: size; height: 200px;">
          <dui-page-inset>
            <p style="margin: 0;">Content is centered with max-width and padding.</p>
          </dui-page-inset>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Custom max-width">
        <div style="border: 1px dashed var(--border); container-type: size; height: 200px;">
          <dui-page-inset max-width="20rem">
            <p style="margin: 0;">Narrower max-width (20rem).</p>
          </dui-page-inset>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
