import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-tooltip")
export class DocsPageTooltip extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-tooltip")!;
    const triggerMeta = componentRegistry.find((c) => c.tagName === "dui-tooltip-trigger")!;
    const popupMeta = componentRegistry.find((c) => c.tagName === "dui-tooltip-popup")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic tooltip">
        <div class="row">
          <dui-tooltip>
            <dui-tooltip-trigger>
              <dui-button variant="outline">Hover me</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>This is a tooltip</dui-tooltip-popup>
          </dui-tooltip>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Bottom placement">
        <div class="row">
          <dui-tooltip side="bottom">
            <dui-tooltip-trigger>
              <dui-button variant="outline">Bottom tooltip</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>Appears below</dui-tooltip-popup>
          </dui-tooltip>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="No delay">
        <div class="row">
          <dui-tooltip delay="0">
            <dui-tooltip-trigger>
              <dui-button variant="outline">Instant tooltip</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>No delay!</dui-tooltip-popup>
          </dui-tooltip>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <div class="row">
          <dui-tooltip disabled>
            <dui-tooltip-trigger>
              <dui-button variant="outline">Disabled tooltip</dui-button>
            </dui-tooltip-trigger>
            <dui-tooltip-popup>You won't see this</dui-tooltip-popup>
          </dui-tooltip>
        </div>
      </dui-docs-demo>

      <h2>API Reference — Tooltip</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Tooltip Trigger</h2>
      ${renderApiTable(triggerMeta)}

      <h2>API Reference — Tooltip Popup</h2>
      ${renderApiTable(popupMeta)}
    `;
  }
}
