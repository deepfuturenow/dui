import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-dialog")
export class DocsPageDialog extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-dialog")!;
    const popupMeta = componentRegistry.find((c) => c.tagName === "dui-dialog-popup")!;
    const triggerMeta = componentRegistry.find((c) => c.tagName === "dui-dialog-trigger")!;
    const closeMeta = componentRegistry.find((c) => c.tagName === "dui-dialog-close")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic dialog">
        <dui-dialog>
          <dui-dialog-trigger>
            <dui-button variant="outline">Open Dialog</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup>
            <span slot="title">Edit Profile</span>
            <span slot="description">Make changes to your profile here. Click save when you're done.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-dialog-close>
                <dui-button variant="outline">Cancel</dui-button>
              </dui-dialog-close>
              <dui-dialog-close>
                <dui-button variant="primary">Save Changes</dui-button>
              </dui-dialog-close>
            </div>
          </dui-dialog-popup>
        </dui-dialog>
      </dui-docs-demo>

      <dui-docs-demo label="Custom width">
        <dui-dialog>
          <dui-dialog-trigger>
            <dui-button variant="outline">Wide Dialog</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup width="36rem">
            <span slot="title">Settings</span>
            <span slot="description">Configure your application settings below.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-dialog-close>
                <dui-button variant="outline">Cancel</dui-button>
              </dui-dialog-close>
              <dui-dialog-close>
                <dui-button variant="primary">Apply</dui-button>
              </dui-dialog-close>
            </div>
          </dui-dialog-popup>
        </dui-dialog>
      </dui-docs-demo>

      <dui-docs-demo label="Closes on backdrop click">
        <dui-dialog>
          <dui-dialog-trigger>
            <dui-button variant="secondary">Click Backdrop to Close</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup>
            <span slot="title">Dismissible Dialog</span>
            <span slot="description">Click the dark backdrop behind this dialog to dismiss it.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-dialog-close>
                <dui-button variant="outline">Close</dui-button>
              </dui-dialog-close>
            </div>
          </dui-dialog-popup>
        </dui-dialog>
      </dui-docs-demo>

      <h2>API Reference — Dialog</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Dialog Popup</h2>
      ${renderApiTable(popupMeta)}

      <h2>API Reference — Dialog Trigger</h2>
      ${renderApiTable(triggerMeta)}

      <h2>API Reference — Dialog Close</h2>
      ${renderApiTable(closeMeta)}
    `;
  }
}
