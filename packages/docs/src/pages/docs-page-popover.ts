import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-popover")
export class DocsPagePopover extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-popover" .additionalTags=${["dui-popover-popup"]}>
        <dui-docs-demo label="Basic popover">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button appearance="outline">Open Popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <div style="padding: var(--space-3); min-width: 200px;">
              <p style="margin: 0 0 var(--space-2); font-weight: 600;">Popover Title</p>
              <p style="margin: 0; color: var(--text-2); font-size: var(--text-sm);">
                This is some popover content. Click outside to close.
              </p>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <dui-docs-demo label="With close button">
        <dui-popover>
          <dui-popover-trigger>
            <dui-button appearance="outline">With Close</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <div style="padding: var(--space-3); min-width: 200px;">
              <p style="margin: 0 0 var(--space-2);">Content here</p>
              <dui-popover-close>
                <dui-button appearance="outline" size="sm">Close</dui-button>
              </dui-popover-close>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>

      <dui-docs-demo label="Top placement">
        <dui-popover side="top">
          <dui-popover-trigger>
            <dui-button appearance="outline">Top Popover</dui-button>
          </dui-popover-trigger>
          <dui-popover-popup>
            <div style="padding: var(--space-3); min-width: 180px;">
              <p style="margin: 0;">Appears above the trigger.</p>
            </div>
          </dui-popover-popup>
        </dui-popover>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
