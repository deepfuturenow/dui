import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-section-panel")
export class DocsPageSectionPanel extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-section-panel">

        <dui-docs-demo label="Basic">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 640px;">
            <dui-section-panel title="System Metrics">
              <div style="color: var(--text-2); font-size: var(--text-sm);">
                Panel body content — stat cards, charts, or any dashboard widget goes here.
              </div>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Badge + LIVE indicator">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 640px;">
            <dui-section-panel title="Live Feed" badge="27" live>
              <div style="color: var(--text-2); font-size: var(--text-sm);">
                Real-time event stream with 27 unread items.
              </div>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Icon, help tooltip, and actions">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 640px;">
            <dui-section-panel title="Risk Overview" help="Composite risk score based on 12 geopolitical indicators.">
              <dui-icon slot="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              </dui-icon>
              <div slot="actions">
                <dui-button size="sm" appearance="ghost">Export</dui-button>
              </div>
              <div style="color: var(--text-2); font-size: var(--text-sm);">
                Risk gauge and country scores would render here.
              </div>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Collapsible (default open)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 640px;">
            <dui-section-panel title="Advanced Details" collapsible>
              <div style="color: var(--text-2); font-size: var(--text-sm); display: flex; flex-direction: column; gap: var(--space-2);">
                <p style="margin: 0;">Expandable panel body. Click the header to collapse.</p>
                <p style="margin: 0;">This section starts open by default.</p>
              </div>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Collapsible (starts closed)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 640px;">
            <dui-section-panel title="Archived Signals" badge="3" collapsible .defaultOpen=${false}>
              <div style="color: var(--text-2); font-size: var(--text-sm);">
                This panel starts collapsed. Click to expand.
              </div>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Full-featured">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 640px;">
            <dui-section-panel
              title="Country Scores"
              badge="8"
              live
              help="Updated every 30 seconds from satellite data."
              collapsible
            >
              <dui-icon slot="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </dui-icon>
              <div slot="actions" style="display: flex; gap: var(--space-2);">
                <dui-button size="sm" appearance="ghost">Refresh</dui-button>
                <dui-button size="sm" appearance="outline">View All</dui-button>
              </div>
              <div style="color: var(--text-2); font-size: var(--text-sm);">
                Score items for each country would render here.
              </div>
            </dui-section-panel>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
