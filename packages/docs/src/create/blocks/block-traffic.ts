import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

const MONTHS = [
  { label: "Jan", desktop: 75, mobile: 45 },
  { label: "Feb", desktop: 60, mobile: 55 },
  { label: "Mar", desktop: 85, mobile: 40 },
  { label: "Apr", desktop: 70, mobile: 65 },
  { label: "May", desktop: 90, mobile: 50 },
  { label: "Jun", desktop: 80, mobile: 60 },
];

@customElement("block-traffic")
export class BlockTraffic extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-1);
    }

    .title {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0;
    }

    .subtitle {
      font-size: var(--font-size-xs, 0.75rem);
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
      gap: 2px;
      flex: 1;
      width: 100%;
    }

    .bar {
      flex: 1;
      border-radius: var(--radius-sm, 0.25rem) var(--radius-sm, 0.25rem) 0 0;
      min-height: 4px;
    }

    .bar.desktop {
      background: var(--accent);
    }

    .bar.mobile {
      background: var(--text-2);
      opacity: 0.4;
    }

    .bar-label {
      font-size: 10px;
      color: var(--text-2);
    }

    .legend {
      display: flex;
      gap: var(--space-4);
      margin-bottom: var(--space-4);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--font-size-xs, 0.75rem);
      color: var(--text-2);
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .legend-dot.desktop {
      background: var(--accent);
    }

    .legend-dot.mobile {
      background: var(--text-2);
      opacity: 0.4;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-2);
      border-top: var(--border-width-thin, 1px) solid var(--border);
      padding-top: var(--space-3);
    }

    .stat-label {
      font-size: 10px;
      color: var(--text-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: var(--font-size-lg, 1.125rem);
      font-weight: 700;
      margin-top: var(--space-1);
    }

    .stat-value.positive {
      color: var(--accent);
    }
  `;

  override render() {
    return html`
      <div class="header">
        <p class="title">Traffic Channels</p>
        <dui-toggle-group type="single" value="6m">
          <dui-toggle value="6m">6M</dui-toggle>
          <dui-toggle value="12m">12M</dui-toggle>
        </dui-toggle-group>
      </div>
      <p class="subtitle">Desktop vs mobile over the last 6 months</p>

      <div class="chart">
        ${MONTHS.map(
          (m) => html`
            <div class="bar-group">
              <div class="bars">
                <div class="bar desktop" style="height: ${m.desktop}%"></div>
                <div class="bar mobile" style="height: ${m.mobile}%"></div>
              </div>
              <span class="bar-label">${m.label}</span>
            </div>
          `,
        )}
      </div>

      <div class="legend">
        <div class="legend-item">
          <span class="legend-dot desktop"></span> Desktop
        </div>
        <div class="legend-item">
          <span class="legend-dot mobile"></span> Mobile
        </div>
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
