import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement } from "lit/decorators.js";
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
  static override styles = [
    blockBase,
    css`
      :host {
        padding: var(--space-6);
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-1);
      }

      .title {
        font-size: var(--font-size-base);
        font-weight: 600;
        margin: 0;
      }

      .subtitle {
        font-size: var(--font-size-xs);
        color: var(--text-2);
        margin: 0 0 var(--space-4);
      }

      dui-chart {
        margin-bottom: var(--space-3);
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-2);
        border-top: var(--border-width-thin) solid var(--border);
        padding-top: var(--space-3);
      }

      .stat-label {
        font-size: 10px;
        color: var(--text-2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .stat-value {
        font-size: var(--font-size-lg);
        font-weight: 700;
        margin-top: var(--space-1);
      }

      .stat-value.positive {
        color: var(--accent);
      }
    `,
  ];

  override render() {
    return html`
      <div class="header">
        <p class="title">Traffic Channels</p>
        <dui-toggle-group type="single" .defaultValue=${["6m"]}>
          <dui-toggle value="6m">6M</dui-toggle>
          <dui-toggle value="12m">12M</dui-toggle>
        </dui-toggle-group>
      </div>
      <p class="subtitle">Traffic over the last 6 months</p>

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
              fill: "red",
              channels: { Month: "month", Visitors: "visitors" },
              format: { x: false, y: false, Month: true, Visitors: true, stroke: true },
              lineHeight: 1.4
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

      <div class="stats">
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
    `;
  }
}
