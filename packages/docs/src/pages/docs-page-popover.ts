import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-popover")
export class DocsPagePopover extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-popover")!;
    const popupMeta = componentRegistry.find((c) => c.tagName === "dui-popover-popup")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic popover">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button variant="outline">Open Popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <div style="padding: var(--space-3); min-width: 200px;">
              <p style="margin: 0 0 var(--space-2); font-weight: 600;">Popover Title</p>
              <p style="margin: 0; color: var(--muted-foreground); font-size: var(--font-size-sm);">
                This is some popover content. Click outside to close.
              </p>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <dui-docs-demo label="With close button">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button variant="outline">With Close</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <div style="padding: var(--space-3); min-width: 200px;">
              <p style="margin: 0 0 var(--space-2);">Content here</p>
              <dui-popover-close>
                <dui-button variant="secondary" size="sm">Close</dui-button>
              </dui-popover-close>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <dui-docs-demo label="Top placement">
        <dui-popover side="top">
          <dui-popover-trigger>
            <dui-button variant="outline">Top Popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <div style="padding: var(--space-3); min-width: 180px;">
              <p style="margin: 0;">Appears above the trigger.</p>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <h2>API Reference — Popover</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Popover Popup</h2>
      ${renderApiTable(popupMeta)}
    `;
  }
}
