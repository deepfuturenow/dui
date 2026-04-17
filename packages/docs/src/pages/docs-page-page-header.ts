import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-page-header")
export class DocsPagePageHeader extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-page-header">

        <dui-docs-demo label="Full — breadcrumbs, subtitle, actions">
          <div style="max-width: 720px;">
            <dui-page-header
              title="System Monitoring"
              subtitle="Real-time metrics and alerts across all active deployments"
              breadcrumbs="Home, Dashboards, Monitoring"
            >
              <dui-button slot="actions" variant="primary" size="sm">New Dashboard</dui-button>
              <dui-button slot="actions" appearance="outline" size="sm">Export</dui-button>
            </dui-page-header>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Title + subtitle only">
          <div style="max-width: 720px;">
            <dui-page-header
              title="Account Settings"
              subtitle="Manage your profile, preferences, and security"
            ></dui-page-header>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Title only — minimal">
          <div style="max-width: 720px;">
            <dui-page-header
              title="Overview"
            ></dui-page-header>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Deep breadcrumbs + actions, no subtitle">
          <div style="max-width: 720px;">
            <dui-page-header
              title="Risk Assessment"
              breadcrumbs="Home, Intelligence, Country Analysis, Risk Assessment"
            >
              <dui-button slot="actions" appearance="ghost" size="sm">Refresh</dui-button>
              <dui-button slot="actions" variant="danger" appearance="outline" size="sm">Clear Alerts</dui-button>
            </dui-page-header>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
