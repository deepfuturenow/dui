import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-link")
export class DocsPageLink extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-link">
        <dui-docs-demo label="Basic">
        <dui-link href="#/components/button">Go to Button page</dui-link>
      </dui-docs-demo>

      <dui-docs-demo label="Inline with text">
        <p style="margin: 0;">
          Check out the
          <dui-link href="#/components/badge" style="color: var(--accent); text-decoration: underline;">Badge component</dui-link>
          for status indicators.
        </p>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
