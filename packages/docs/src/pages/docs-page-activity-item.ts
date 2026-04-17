import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-activity-item")
export class DocsPageActivityItem extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-activity-item">

        <dui-docs-demo label="Deployment timeline">
          <div style="max-width: 560px;">
            <dui-activity-item
              title="Production deploy v2.4.1"
              timestamp="2 min ago"
              status="success"
              status-label="Success"
              description="Deployed by CI/CD pipeline. 3 services updated, 0 rollbacks."
            ></dui-activity-item>

            <dui-activity-item
              title="Integration tests completed"
              timestamp="8 min ago"
              status="success"
              description="All 342 tests passed in 4m 12s."
            ></dui-activity-item>

            <dui-activity-item
              title="Staging deploy failed"
              timestamp="23 min ago"
              status="error"
              status-label="Failed"
              description="Container health check timed out after 120s. Rolled back to v2.4.0."
            >
              <div slot="actions">
                <dui-button size="sm" variant="outline">View Logs</dui-button>
              </div>
            </dui-activity-item>

            <dui-activity-item
              title="Build #1847 started"
              timestamp="31 min ago"
              status="pending"
              description="Triggered by push to main branch."
            ></dui-activity-item>

            <dui-activity-item
              title="Security scan completed"
              timestamp="1 hr ago"
              status="warning"
              status-label="2 Warnings"
              description="Found 2 medium-severity CVEs in transitive dependencies."
              last
            ></dui-activity-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Status colors">
          <div style="max-width: 560px;">
            <dui-activity-item
              title="Successful operation"
              timestamp="Just now"
              status="success"
            ></dui-activity-item>

            <dui-activity-item
              title="Error encountered"
              timestamp="1 min ago"
              status="error"
            ></dui-activity-item>

            <dui-activity-item
              title="Warning issued"
              timestamp="3 min ago"
              status="warning"
            ></dui-activity-item>

            <dui-activity-item
              title="Informational event"
              timestamp="5 min ago"
              status="info"
            ></dui-activity-item>

            <dui-activity-item
              title="Pending action"
              timestamp="10 min ago"
              status="pending"
              last
            ></dui-activity-item>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (title + timestamp)">
          <div style="max-width: 560px;">
            <dui-activity-item
              title="User logged in"
              timestamp="Just now"
            ></dui-activity-item>

            <dui-activity-item
              title="Settings updated"
              timestamp="5 min ago"
            ></dui-activity-item>

            <dui-activity-item
              title="Account created"
              timestamp="1 hr ago"
              last
            ></dui-activity-item>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
