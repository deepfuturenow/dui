import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-feed-item")
export class DocsPageFeedItem extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-feed-item">

        <dui-docs-demo label="Basic">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-feed-item
              title="Earthquake detected near Portland, OR"
              subtitle="USGS Pacific Northwest"
              timestamp="2 min ago"
              category="Seismic"
              severity="high"
              description="Magnitude 4.2 recorded at 45.52°N, 122.68°W. No tsunami warning issued."
            ></dui-feed-item>

            <dui-feed-item
              title="Severe weather advisory issued"
              subtitle="NWS Central Region"
              timestamp="14 min ago"
              category="Weather"
              severity="medium"
              description="Tornado watch in effect for eastern Kansas through 10 PM CDT."
            ></dui-feed-item>

            <dui-feed-item
              title="Routine sensor calibration complete"
              subtitle="Station ALFA-7"
              timestamp="1 hr ago"
              category="Maintenance"
              severity="low"
            ></dui-feed-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Severity levels">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-feed-item
              title="Critical infrastructure failure"
              subtitle="Power Grid Monitor"
              timestamp="Just now"
              severity="critical"
            ></dui-feed-item>

            <dui-feed-item
              title="Elevated radiation levels detected"
              subtitle="EPA RadNet Station 42"
              timestamp="5 min ago"
              severity="high"
            ></dui-feed-item>

            <dui-feed-item
              title="Unusual network traffic pattern"
              subtitle="NOC East"
              timestamp="12 min ago"
              severity="medium"
            ></dui-feed-item>

            <dui-feed-item
              title="Scheduled backup completed"
              subtitle="Archive System"
              timestamp="30 min ago"
              severity="low"
            ></dui-feed-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (title + timestamp only)">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-feed-item
              title="System health check passed"
              timestamp="3 min ago"
            ></dui-feed-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="display:flex; flex-direction:column; gap: var(--space-3); max-width: 560px;">
            <dui-feed-item
              title="New intelligence report available"
              subtitle="OSINT Aggregator"
              timestamp="8 min ago"
              category="Intel"
              severity="medium"
              description="Source correlation report for Southeast Asia maritime activity."
            >
              <div slot="actions" style="display: flex; gap: var(--space-2);">
                <dui-button size="sm">View Report</dui-button>
                <dui-button size="sm" variant="outline">Dismiss</dui-button>
              </div>
            </dui-feed-item>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
