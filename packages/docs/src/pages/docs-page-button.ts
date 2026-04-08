import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-button")
export class DocsPageButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-button">
        <dui-docs-demo label="Variants (intent)">
        <docs-row>
          <dui-button>Neutral</dui-button>
          <dui-button variant="primary">Primary</dui-button>
          <dui-button variant="danger">Danger</dui-button>
          <dui-button variant="success">Success</dui-button>
          <dui-button variant="warning">Warning</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Appearances (treatment)">
        <docs-row>
          <dui-button variant="primary">Filled</dui-button>
          <dui-button variant="primary" appearance="outline">Outline</dui-button>
          <dui-button variant="primary" appearance="ghost">Ghost</dui-button>
          <dui-button variant="primary" appearance="link">Link</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Variant × Appearance">
        <docs-row>
          <dui-button variant="danger">Danger Filled</dui-button>
          <dui-button variant="danger" appearance="outline">Danger Outline</dui-button>
          <dui-button variant="danger" appearance="ghost">Danger Ghost</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <docs-row>
          <dui-button size="sm">Small</dui-button>
          <dui-button size="md">Medium</dui-button>
          <dui-button size="lg">Large</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled / Link">
        <docs-row>
          <dui-button disabled>Disabled</dui-button>
          <dui-button href="/example">Link button</dui-button>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
