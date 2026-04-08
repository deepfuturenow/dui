import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-alert-dialog")
export class DocsPageAlertDialog extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-alert-dialog" .additionalTags=${["dui-alert-dialog-popup","dui-alert-dialog-trigger","dui-alert-dialog-close"]}>
        <dui-docs-demo label="Destructive confirmation">
        <dui-alert-dialog>
          <dui-alert-dialog-trigger>
            <dui-button variant="danger">Delete Account</dui-button>
          </dui-alert-dialog-trigger>
          <dui-alert-dialog-popup>
            <span slot="title">Are you absolutely sure?</span>
            <span slot="description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-alert-dialog-close>
                <dui-button appearance="outline">Cancel</dui-button>
              </dui-alert-dialog-close>
              <dui-alert-dialog-close>
                <dui-button variant="danger">Yes, delete account</dui-button>
              </dui-alert-dialog-close>
            </div>
          </dui-alert-dialog-popup>
        </dui-alert-dialog>
      </dui-docs-demo>

      <dui-docs-demo label="Backdrop does not close">
        <dui-alert-dialog>
          <dui-alert-dialog-trigger>
            <dui-button appearance="outline">Requires Action</dui-button>
          </dui-alert-dialog-trigger>
          <dui-alert-dialog-popup>
            <span slot="title">Unsaved Changes</span>
            <span slot="description">You have unsaved changes. Clicking the backdrop will not close this dialog — you must choose an action.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-alert-dialog-close>
                <dui-button appearance="outline">Discard</dui-button>
              </dui-alert-dialog-close>
              <dui-alert-dialog-close>
                <dui-button variant="primary">Save</dui-button>
              </dui-alert-dialog-close>
            </div>
          </dui-alert-dialog-popup>
        </dui-alert-dialog>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
