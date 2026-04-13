import { LitElement, html, css, svg } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Canned daily closing prices for July 2023 (20 trading days).
 * TSLA: opened month at $279.82, closed at $267.43 (−4.43%)
 * AAPL: opened month at $189.97, closed at $193.91 (+2.08%)
 * Source: StatMuse / public historical data.
 */
interface StockChip {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  /** Daily closing prices, Jul 3 → Jul 31 2023 */
  series: number[];
}

const STOCKS: StockChip[] = [
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 267.43,
    change: -12.39,
    changePct: -4.43,
    series: [
      279.82, 282.48, 276.54, 274.43, 269.61, 269.79, 271.99, 277.90, 281.38,
      290.38, 293.34, 291.26, 262.90, 260.02, 269.06, 265.28, 264.35, 255.71,
      266.44, 267.43,
    ],
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 193.91,
    change: 3.94,
    changePct: 2.08,
    series: [
      189.97, 188.86, 189.33, 188.22, 186.17, 185.65, 187.32, 188.08, 188.23,
      191.48, 191.23, 192.58, 190.64, 189.46, 190.26, 191.12, 191.99, 190.72,
      193.30, 193.91,
    ],
  },
];

/** Build an SVG sparkline path + area fill from a data series. */
function sparklinePath(
  series: number[],
  w: number,
  h: number,
  pad = 2,
): { line: string; area: string } {
  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const stepX = w / (series.length - 1);

  const pts = series.map((v, i) => ({
    x: i * stepX,
    y: pad + (1 - (v - min) / range) * (h - pad * 2),
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(
    " ",
  );
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`;

  return { line, area };
}

@customElement("block-watchlist")
export class BlockWatchlist extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .chips {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .chip {
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      background: var(--surface-2);
      color: var(--text-1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .chip-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-4) var(--space-4) 0;
    }

    .symbol-group {
      display: flex;
      align-items: center;
      gap: var(--space-1-5);
    }

    .arrow {
      font-size: var(--font-size-xs);
    }

    .arrow.up { color: var(--color-green-500, #22c55e); }
    .arrow.down { color: var(--color-red-500, #ef4444); }

    .symbol {
      font-size: var(--font-size-sm);
      font-weight: 600;
    }

    .pct {
      font-size: var(--font-size-xs);
      font-weight: 500;
      font-family: var(--font-mono);
    }

    .pct.up { color: var(--color-green-500, #22c55e); }
    .pct.down { color: var(--color-red-500, #ef4444); }

    .sub-row {
      display: flex;
      justify-content: space-between;
      padding: 0 var(--space-4);
    }

    .name {
      font-size: var(--font-size-xs);
      color: var(--text-2);
    }

    .change {
      font-size: var(--font-size-xs);
      font-family: var(--font-mono);
    }

    .change.up { color: var(--color-green-500, #22c55e); }
    .change.down { color: var(--color-red-500, #ef4444); }

    .chart {
      padding: var(--space-2) var(--space-4) 0;
      flex: 1;
    }

    .chart svg {
      display: block;
      width: 100%;
      height: 48px;
    }

    .price {
      font-size: var(--font-size-2xl);
      font-weight: 700;
      padding: var(--space-3) var(--space-4) var(--space-2);
    }
  `;

  override render() {
    return html`
      <div class="chips">
        ${STOCKS.map((s) => {
          const up = s.change >= 0;
          const dir = up ? "up" : "down";
          const sign = up ? "+" : "";
          const { line, area } = sparklinePath(s.series, 200, 48);
          const color = up
            ? "var(--color-green-500, #22c55e)"
            : "var(--color-red-500, #ef4444)";
          const id = `grad-${s.symbol.toLowerCase()}`;

          return html`
            <div class="chip">
              <div class="chip-header">
                <div class="symbol-group">
                  <span class="arrow ${dir}">${up ? "▲" : "▼"}</span>
                  <span class="symbol">${s.symbol}</span>
                </div>
                <span class="pct ${dir}">${sign}${s.changePct.toFixed(2)}%</span>
              </div>

              <div class="sub-row">
                <span class="name">${s.name}</span>
                <span class="change ${dir}">${sign}${s.change.toFixed(2)}</span>
              </div>

              <div class="chart">
                ${svg`
                  <svg viewBox="0 0 200 48" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${color}" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="${color}" stop-opacity="0.03" />
                      </linearGradient>
                    </defs>
                    <path d="${area}" fill="url(#${id})" />
                    <path d="${line}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round" />
                  </svg>
                `}
              </div>

              <div class="price">${s.price.toFixed(2)}</div>
            </div>
          `;
        })}
      </div>
    `;
  }
}
