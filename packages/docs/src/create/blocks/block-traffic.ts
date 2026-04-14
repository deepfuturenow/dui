import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement } from "lit/decorators.js";

const MONTHS = [
  { label: "Jan", value: 75 },
  { label: "Feb", value: 60 },
  { label: "Mar", value: 85 },
  { label: "Apr", value: 70 },
  { label: "May", value: 90 },
  { label: "Jun", value: 80 },
];

@customElement("block-traffic")
export class BlockTraffic extends LitElement {
  static override styles = [blockBase, css`
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

    .chart {
      display: flex;
      align-items: flex-end;
      gap: var(--space-2);
      height: 120px;
      margin-bottom: var(--space-3);
    }

    .bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-1);
      height: 100%;
    }

    .bars {
      display: flex;
      align-items: flex-end;
      flex: 1;
      width: 100%;
    }

    .bar {
      width: 100%;
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
      min-height: 4px;
      background: var(--accent);
    }

    .bar-label {
      font-size: 10px;
      color: var(--text-2);
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
  `];

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

      <div class="chart">
        ${MONTHS.map(
          (m) => html`
            <div class="bar-group">
              <div class="bars">
                <div class="bar" style="height: ${m.value}%"></div>
              </div>
              <span class="bar-label">${m.label}</span>
            </div>
          `,
        )}
      </div>

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
