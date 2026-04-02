import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-dialog")
export class DocsPageDialog extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-dialog" .additionalTags=${["dui-dialog-popup","dui-dialog-trigger","dui-dialog-close"]}>
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
      </docs-page-layout>
    `;
  }
}
