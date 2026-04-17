import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-risk-gauge")
export class DocsPageRiskGauge extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-template-layout tag="dui-risk-gauge">

        <dui-docs-demo label="Severity levels">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-3); max-width: 720px;">
            <dui-risk-gauge
              label="Global Risk Index"
              .value=${78}
              severity="high"
              trend="+5 pts"
              trend-direction="up"
            ></dui-risk-gauge>

            <dui-risk-gauge
              label="Threat Level"
              .value=${45}
              severity="medium"
              trend="-3 pts"
              trend-direction="down"
            ></dui-risk-gauge>

            <dui-risk-gauge
              label="System Health"
              .value=${92}
              severity="low"
              trend="0 pts"
              trend-direction="stable"
            ></dui-risk-gauge>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="All severity colors">
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-3); max-width: 960px;">
            <dui-risk-gauge
              label="Critical"
              .value=${95}
              severity="critical"
            ></dui-risk-gauge>

            <dui-risk-gauge
              label="High"
              .value=${75}
              severity="high"
            ></dui-risk-gauge>

            <dui-risk-gauge
              label="Medium"
              .value=${50}
              severity="medium"
            ></dui-risk-gauge>

            <dui-risk-gauge
              label="Low"
              .value=${25}
              severity="low"
            ></dui-risk-gauge>

            <dui-risk-gauge
              label="Info"
              .value=${10}
              severity="info"
            ></dui-risk-gauge>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Minimal (value + label only)">
          <div style="max-width: 240px;">
            <dui-risk-gauge
              label="Confidence Score"
              .value=${63}
            ></dui-risk-gauge>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="With actions slot">
          <div style="max-width: 240px;">
            <dui-risk-gauge
              label="Network Security"
              .value=${82}
              severity="high"
              trend="+8 pts"
              trend-direction="up"
            >
              <div slot="actions">
                <dui-button size="sm">View Report</dui-button>
              </div>
            </dui-risk-gauge>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
