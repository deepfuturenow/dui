import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-vstack")
export class DocsPageVstack extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-vstack">
        <dui-docs-demo label="Default (gap=4)">
        <dui-vstack>
          <dui-badge>One</dui-badge>
          <dui-badge>Two</dui-badge>
          <dui-badge>Three</dui-badge>
        </dui-vstack>
      </dui-docs-demo>

      <dui-docs-demo label="Gap sizes">
        <div class="row" style="align-items: start;">
          <dui-vstack gap="1" style="width: auto;">
            <dui-badge variant="secondary">gap=1</dui-badge>
            <dui-badge variant="secondary">A</dui-badge>
            <dui-badge variant="secondary">B</dui-badge>
          </dui-vstack>
          <dui-vstack gap="4" style="width: auto;">
            <dui-badge variant="secondary">gap=4</dui-badge>
            <dui-badge variant="secondary">A</dui-badge>
            <dui-badge variant="secondary">B</dui-badge>
          </dui-vstack>
          <dui-vstack gap="8" style="width: auto;">
            <dui-badge variant="secondary">gap=8</dui-badge>
            <dui-badge variant="secondary">A</dui-badge>
            <dui-badge variant="secondary">B</dui-badge>
          </dui-vstack>
        </div>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
