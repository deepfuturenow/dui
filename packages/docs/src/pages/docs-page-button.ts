import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-button")
export class DocsPageButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-button">
        <dui-docs-demo label="Variants">
        <docs-row>
          <dui-button>Default</dui-button>
          <dui-button variant="secondary">Secondary</dui-button>
          <dui-button variant="destructive">Destructive</dui-button>
          <dui-button variant="outline">Outline</dui-button>
          <dui-button variant="ghost">Ghost</dui-button>
          <dui-button variant="link">Link</dui-button>
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
