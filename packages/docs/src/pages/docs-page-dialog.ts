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
            <dui-button appearance="outline">Open Dialog</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup width="30rem">
            <span slot="title">Edit Profile</span>
            <span slot="description">Make changes to your profile here. Click save when you're done. Labore incididunt enim Lorem enim est ad voluptate ea ut amet dolore. Quis minim exercitation id culpa nisi nulla officia do reprehenderit nisi officia sunt velit.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
              <dui-dialog-close>
                <dui-button appearance="outline">Cancel</dui-button>
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
            <dui-button appearance="outline">Wide Dialog</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup width="36rem">
            <span slot="title">Settings</span>
            <span slot="description">Configure your application settings below.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
              <dui-dialog-close>
                <dui-button appearance="outline">Cancel</dui-button>
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
            <dui-button appearance="outline">Click Backdrop to Close</dui-button>
          </dui-dialog-trigger>
          <dui-dialog-popup>
            <span slot="title">Dismissible Dialog</span>
            <span slot="description">Click the dark backdrop behind this dialog to dismiss it.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end;">
              <dui-dialog-close>
                <dui-button appearance="outline">Close</dui-button>
              </dui-dialog-close>
            </div>
          </dui-dialog-popup>
        </dui-dialog>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
