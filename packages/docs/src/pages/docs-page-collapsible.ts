import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-collapsible")
export class DocsPageCollapsible extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-collapsible">
        <dui-docs-demo label="Default (closed)" demo-width="25rem">
        <dui-collapsible>
          <span slot="trigger">Click to expand</span>
          This content is revealed when the collapsible is opened. It animates
          smoothly with a height transition.
        </dui-collapsible>
      </dui-docs-demo>

      <dui-docs-demo label="Default open" demo-width="26rem">
        <dui-collapsible default-open>
          <span slot="trigger">Started open</span>
          This collapsible starts in the open state using the default-open attribute.
        </dui-collapsible>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled" demo-width="26rem">
        <dui-collapsible disabled>
          <span slot="trigger">Cannot toggle</span>
          This content is not reachable.
        </dui-collapsible>
      </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
