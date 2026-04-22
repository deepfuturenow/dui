import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-card")
export class DocsPageCard extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-card">

        <dui-docs-demo label="With footer">
          <div style="max-width: 420px;">
            <dui-card>
              <span slot="title">Account settings</span>
              <span slot="description">Update your profile information</span>
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                <dui-input placeholder="Display name" value="Jane Doe"></dui-input>
                <dui-input placeholder="Email" value="jane@example.com"></dui-input>
              </div>
              <dui-button slot="footer" appearance="soft">Cancel</dui-button>
              <dui-button slot="footer" variant="primary">Save</dui-button>
            </dui-card>
          </div>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
