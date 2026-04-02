import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-tooltip")
export class DocsPageTooltip extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-tooltip" .additionalTags=${["dui-tooltip-trigger","dui-tooltip-popup"]}>
        <dui-docs-demo label="Basic tooltip">
        <docs-row>
          <dui-tooltip>
            <dui-tooltip-trigger>
              <dui-button variant="outline">Hover me</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>This is a tooltip</dui-tooltip-popup>
          </dui-tooltip>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Bottom placement">
        <docs-row>
          <dui-tooltip side="bottom">
            <dui-tooltip-trigger>
              <dui-button variant="outline">Bottom tooltip</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>Appears below</dui-tooltip-popup>
          </dui-tooltip>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="No delay">
        <docs-row>
          <dui-tooltip delay="0">
            <dui-tooltip-trigger>
              <dui-button variant="outline">Instant tooltip</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>No delay!</dui-tooltip-popup>
          </dui-tooltip>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <docs-row>
          <dui-tooltip disabled>
            <dui-tooltip-trigger>
              <dui-button variant="outline">Disabled tooltip</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>You won't see this</dui-tooltip-popup>
          </dui-tooltip>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
