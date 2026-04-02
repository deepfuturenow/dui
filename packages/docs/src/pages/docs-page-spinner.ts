import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-spinner")
export class DocsPageSpinner extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-spinner">
        <dui-docs-demo label="Variants">
        <docs-row>
          <dui-spinner variant="pulse"></dui-spinner>
          <dui-spinner variant="lucide-loader"></dui-spinner>
          <dui-spinner variant="lucide-loader-circle"></dui-spinner>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <docs-row>
          <dui-spinner size="sm"></dui-spinner>
          <dui-spinner size="md"></dui-spinner>
          <dui-spinner size="lg"></dui-spinner>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes — lucide-loader-circle">
        <docs-row>
          <dui-spinner variant="lucide-loader-circle" size="sm"></dui-spinner>
          <dui-spinner variant="lucide-loader-circle" size="md"></dui-spinner>
          <dui-spinner variant="lucide-loader-circle" size="lg"></dui-spinner>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
