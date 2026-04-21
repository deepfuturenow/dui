import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";

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

    .chart {
      display: flex;
      align-items: flex-end;
      gap: var(--space-2);
      height: 120px;
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
      min-height: var(--space-1);
      background: var(--accent);
    }

    .bar-label {
      font-size: var(--text-2xs);
      color: var(--text-2);
      text-box: trim-both cap alphabetic;
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
