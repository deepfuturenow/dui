import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-stat-card")
export class DocsPageStatCard extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-stat-card">

        <dui-docs-demo label="Basic">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); max-width: 720px;">
            <dui-stat-card
              label="Total Events"
              value="1,284"
              trend="+12.3%"
              trend-direction="up"
              description="vs. previous 24h"
            ></dui-stat-card>

            <dui-stat-card
              label="Avg Response Time"
              value="142ms"
              trend="-8.1%"
              trend-direction="down"
              description="Last 7 days"
            ></dui-stat-card>

            <dui-stat-card
              label="Uptime"
              value="99.97%"
              trend="0%"
              trend-direction="stable"
              description="30-day rolling"
            ></dui-stat-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Trend directions">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); max-width: 720px;">
            <dui-stat-card
              label="Revenue"
              value="$42.5K"
              trend="+18.2%"
              trend-direction="up"
            ></dui-stat-card>

            <dui-stat-card
              label="Error Rate"
              value="0.03%"
              trend="-52%"
              trend-direction="down"
            ></dui-stat-card>

            <dui-stat-card
              label="Active Users"
              value="3,891"
              trend="0%"
              trend-direction="stable"
            ></dui-stat-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (value only)">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); max-width: 720px;">
            <dui-stat-card
              label="Open Tickets"
              value="47"
            ></dui-stat-card>

            <dui-stat-card
              label="Deployments Today"
              value="12"
            ></dui-stat-card>

            <dui-stat-card
              label="P95 Latency"
              value="284ms"
            ></dui-stat-card>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="max-width: 280px;">
            <dui-stat-card
              label="Critical Alerts"
              value="7"
              trend="+3"
              trend-direction="up"
              description="Requires immediate attention"
            >
              <div slot="actions">
                <dui-button size="sm">View All</dui-button>
              </div>
            </dui-stat-card>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
