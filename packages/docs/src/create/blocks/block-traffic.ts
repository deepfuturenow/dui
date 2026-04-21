import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";
import * as Plot from "@observablehq/plot";

const MONTHS = [
  { month: "Jan", visitors: 75 },
  { month: "Feb", visitors: 60 },
  { month: "Mar", visitors: 85 },
  { month: "Apr", visitors: 70 },
  { month: "May", visitors: 90 },
  { month: "Jun", visitors: 80 },
];

@customElement("block-traffic")
export class BlockTraffic extends LitElement {
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    /* Card */

    dui-card::part(root) {
      --card-action-offset-top: 0;
      --card-action-offset-end: 0;
    }

    dui-chart {
      margin-bottom: var(--space-3);
    }

    /* Footer */

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
      border-top: var(--border-width-thin) solid var(--border);
      padding-top: var(--space-3);
      width: 100%;
    }

    .stat-label {
      font-size: var(--text-2xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-box: trim-both cap alphabetic;
      margin-bottom: var(--space-3);
    }

    .stat-value {
      font-size: var(--text-2xl);
      font-weight: var(--font-weight-semibold);
      text-box: trim-both cap alphabetic;
    }

    .stat-value.positive {
      color: var(--accent);
    }
  `];

  override render() {
    return html`
      <dui-card>
        <span slot="title">Traffic Channels</span>
        <span slot="description">Traffic over the last 6 months</span>
        <dui-toggle-group slot="action" type="single" .defaultValue=${["6m"]}>
          <dui-toggle value="6m">6M</dui-toggle>
          <dui-toggle value="12m">12M</dui-toggle>
        </dui-toggle-group>

        <dui-chart
          .spec=${{
            marks: [
              Plot.barY(MONTHS, {
                x: "month",
                y: "visitors",
                fill: "var(--chart-color-1)",
                ry1: 3,
              }),
              Plot.tip(MONTHS, Plot.pointerX({
                x: "month",
                y: "visitors",
                channels: { Month: "month", Visitors: "visitors" },
                format: { x: false, y: false, Month: true, Visitors: true },
                lineHeight: 1.4,
              })),
              Plot.ruleY([0], { strokeWidth: 0 }),
            ],
            x: {
              label: null,
              paddingInner: 0.15,
              paddingOuter: 0,
              tickSize: 0,
              domain: MONTHS.map((m) => m.month),
            },
            y: { label: null, domain: [0, 100], ticks: 0 },
            height: 120,
            marginTop: 0,
            marginBottom: 24,
            marginLeft: 0,
            marginRight: 0,
            style: { background: "transparent" },
          }}
        ></dui-chart>

        <div slot="footer" class="stats">
          <div>
            <div class="stat-label">Desktop</div>
            <div class="stat-value">1,224</div>
          </div>
          <div>
            <div class="stat-label">Mobile</div>
            <div class="stat-value">860</div>
          </div>
          <div>
            <div class="stat-label">Mix Delta</div>
            <div class="stat-value positive">+42%</div>
          </div>
        </div>
      </dui-card>
    `;
  }
}
