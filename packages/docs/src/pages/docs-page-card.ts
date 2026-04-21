import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-card")
export class DocsPageCard extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-card">

        <dui-docs-demo label="Basic">
          <div style="max-width: 420px;">
            <dui-card>
              <span slot="title">Montréal</span>
              <span slot="description">The city and its surroundings</span>
              <p>Montréal is the largest city in Québec and the second-largest
                in Canada. It sits on an island in the Saint Lawrence River and
                is known for its festivals, food scene, and bilingual culture.</p>
            </dui-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With header action">
          <div style="max-width: 420px;">
            <dui-card>
              <span slot="title">Create project</span>
              <span slot="description">Start something new</span>
              <dui-button slot="action" appearance="ghost" size="icon-sm">
                <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon>
              </dui-button>
              <dui-input placeholder="Project name"></dui-input>
            </dui-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With footer">
          <div style="max-width: 420px;">
            <dui-card>
              <span slot="title">Account settings</span>
              <span slot="description">Update your profile information</span>
              <div style="display: flex; flex-direction: column; gap: var(--space-3);">
                <dui-input placeholder="Display name" value="Jane Doe"></dui-input>
                <dui-input placeholder="Email" value="jane@example.com"></dui-input>
              </div>
              <dui-button slot="footer" appearance="ghost">Cancel</dui-button>
              <dui-button slot="footer">Save</dui-button>
            </dui-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Small size">
          <div style="max-width: 360px;">
            <dui-card size="sm">
              <span slot="title">Quick note</span>
              <span slot="description">Compact card variant</span>
              <p>The small size uses tighter padding and gap.</p>
            </dui-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Content only (no header)">
          <div style="max-width: 420px;">
            <dui-card>
              <p>A card with only default-slot content — the header is
                automatically hidden when no title, description, or action
                is provided.</p>
            </dui-card>
          </div>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
