import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-empty-state")
export class DocsPageEmptyState extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-empty-state">

        <dui-docs-demo label="With action button">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <div style="border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md);">
              <dui-empty-state
                heading="No events yet"
                description="Events will appear here once your monitoring rules start detecting activity."
              >
                <dui-button slot="actions" variant="primary" size="sm">Configure Rules</dui-button>
              </dui-empty-state>
            </div>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Without action">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <div style="border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md);">
              <dui-empty-state
                heading="No results found"
                description="Try adjusting your filters or search query."
              ></dui-empty-state>
            </div>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Heading only">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <div style="border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md);">
              <dui-empty-state
                heading="Nothing here yet"
              ></dui-empty-state>
            </div>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Custom icon">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <div style="border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md);">
              <dui-empty-state
                heading="No alerts"
                description="Your system is running smoothly with no active alerts."
              >
                <dui-icon slot="icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                  </svg>
                </dui-icon>
              </dui-empty-state>
            </div>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Inside a section panel">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-section-panel title="Live Feed" badge="0">
              <dui-empty-state
                heading="No live events"
                description="The feed is quiet. Events will stream in as they are detected."
              ></dui-empty-state>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
