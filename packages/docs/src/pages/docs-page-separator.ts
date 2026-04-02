import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-separator")
export class DocsPageSeparator extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-separator">
        <dui-docs-demo label="Horizontal">
        <div>
          <p style="margin: 0 0 var(--space-3);">Content above</p>
          <dui-separator></dui-separator>
          <p style="margin: var(--space-3) 0 0;">Content below</p>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Vertical">
        <div class="row" style="height: var(--space-6);">
          <span>Left</span>
          <dui-separator orientation="vertical"></dui-separator>
          <span>Center</span>
          <dui-separator orientation="vertical"></dui-separator>
          <span>Right</span>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
