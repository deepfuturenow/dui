import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-alert-dialog")
export class DocsPageAlertDialog extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-alert-dialog")!;
    const popupMeta = componentRegistry.find((c) => c.tagName === "dui-alert-dialog-popup")!;
    const triggerMeta = componentRegistry.find((c) => c.tagName === "dui-alert-dialog-trigger")!;
    const closeMeta = componentRegistry.find((c) => c.tagName === "dui-alert-dialog-close")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Destructive confirmation">
        <dui-alert-dialog>
          <dui-alert-dialog-trigger>
            <dui-button variant="destructive">Delete Account</dui-button>
          </dui-alert-dialog-trigger>
          <dui-alert-dialog-popup>
            <span slot="title">Are you absolutely sure?</span>
            <span slot="description">This action cannot be undone. This will permanently delete your account and remove your data from our servers.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-alert-dialog-close>
                <dui-button variant="outline">Cancel</dui-button>
              </dui-alert-dialog-close>
              <dui-alert-dialog-close>
                <dui-button variant="destructive">Yes, delete account</dui-button>
              </dui-alert-dialog-close>
            </div>
          </dui-alert-dialog-popup>
        </dui-alert-dialog>
      </dui-docs-demo>

      <dui-docs-demo label="Backdrop does not close">
        <dui-alert-dialog>
          <dui-alert-dialog-trigger>
            <dui-button variant="outline">Requires Action</dui-button>
          </dui-alert-dialog-trigger>
          <dui-alert-dialog-popup>
            <span slot="title">Unsaved Changes</span>
            <span slot="description">You have unsaved changes. Clicking the backdrop will not close this dialog — you must choose an action.</span>
            <div style="display: flex; gap: var(--space-2); justify-content: flex-end; margin-top: var(--space-4);">
              <dui-alert-dialog-close>
                <dui-button variant="outline">Discard</dui-button>
              </dui-alert-dialog-close>
              <dui-alert-dialog-close>
                <dui-button variant="primary">Save</dui-button>
              </dui-alert-dialog-close>
            </div>
          </dui-alert-dialog-popup>
        </dui-alert-dialog>
      </dui-docs-demo>

      <h2>API Reference — Alert Dialog</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Alert Dialog Popup</h2>
      ${renderApiTable(popupMeta)}

      <h2>API Reference — Alert Dialog Trigger</h2>
      ${renderApiTable(triggerMeta)}

      <h2>API Reference — Alert Dialog Close</h2>
      ${renderApiTable(closeMeta)}
    `;
  }
}
