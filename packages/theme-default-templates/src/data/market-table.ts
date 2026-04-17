import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiIcon } from "@dui/components/icon";

/** A single row in the market table. */
export interface MarketRow {
  /** Ticker symbol (e.g. "AAPL", "BTC"). */
  symbol: string;
  /** Full name (e.g. "Apple Inc."). Optional. */
  name?: string;
  /** Current price. */
  price: number;
  /** Absolute change (positive or negative). */
  change: number;
  /** Percentage change (positive or negative). */
  changePercent: number;
}

const styles = css`
  :host {
    display: block;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    letter-spacing: var(--letter-spacing-wide);
  }

  thead th {
    padding: var(--space-2) var(--space-3);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    color: var(--text-3);
    text-align: left;
    border-bottom: var(--border-width-thin) solid var(--border);
    white-space: nowrap;
  }

  thead th.align-end {
    text-align: right;
  }

  tbody tr {
    transition: background var(--duration-fast) ease;
  }

  tbody tr:hover {
    background: var(--surface-2);
  }

  tbody td {
    padding: var(--space-2) var(--space-3);
    border-bottom: var(--border-width-thin) solid var(--border);
    line-height: var(--line-height-snug);
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  .symbol {
    font-weight: var(--font-weight-semibold);
    color: var(--foreground);
  }

  .name {
    color: var(--text-2);
    font-size: var(--font-size-xs);
    margin-left: var(--space-1);
  }

  .price {
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--foreground);
  }

  .change {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .pct {
    text-align: right;
    font-variant-numeric: tabular-nums;
    font-weight: var(--font-weight-medium);
  }

  .positive {
    color: var(--accent-text);
  }

  .negative {
    color: var(--destructive-text);
  }

  .neutral {
    color: var(--text-3);
  }

  .arrow {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
    margin-right: var(--space-0_5);
  }

  .empty {
    padding: var(--space-6) var(--space-4);
    text-align: center;
    color: var(--text-3);
    font-size: var(--font-size-sm);
  }
`;

/**
 * `<dui-market-table>` — A compact financial ticker table.
 *
 * Renders rows of symbols with prices, absolute change, and percentage change.
 * Positive changes are colored with the accent token; negative with destructive.
 * Each row includes a directional arrow indicator.
 *
 * @csspart table - The `<table>` element.
 * @csspart thead - The `<thead>` element.
 * @csspart tbody - The `<tbody>` element.
 */
export class DuiMarketTable extends LitElement {
  static tagName = "dui-market-table" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiIcon];

  /** Array of market data rows. */
  @property({ type: Array }) accessor data: MarketRow[] = [];

  /** Number of decimal places for prices. */
  @property({ type: Number, attribute: "price-precision" }) accessor pricePrecision = 2;

  /** Currency symbol prepended to prices. */
  @property({ attribute: "currency-symbol" }) accessor currencySymbol = "$";

  /** Text shown when data is empty. */
  @property({ attribute: "empty-text" }) accessor emptyText = "No market data";

  #formatPrice(price: number): string {
    return `${this.currencySymbol}${price.toFixed(this.pricePrecision)}`;
  }

  #formatChange(change: number): string {
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(this.pricePrecision)}`;
  }

  #formatPercent(pct: number): string {
    const sign = pct > 0 ? "+" : "";
    return `${sign}${pct.toFixed(2)}%`;
  }

  #changeClass(value: number): string {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
  }

  #renderArrow(change: number): TemplateResult | typeof nothing {
    if (change === 0) return nothing;
    const path = change > 0
      ? "M12 19V5M5 12l7-7 7 7"   // up arrow
      : "M12 5v14M19 12l-7 7-7-7"; // down arrow
    return html`
      <span class="arrow">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          stroke-linejoin="round"><path d="${path}"/></svg>
      </span>
    `;
  }

  override render(): TemplateResult {
    if (this.data.length === 0) {
      return html`<div class="empty">${this.emptyText}</div>`;
    }

    return html`
      <table part="table">
        <thead part="thead">
          <tr>
            <th>Symbol</th>
            <th class="align-end">Price</th>
            <th class="align-end">Change</th>
            <th class="align-end">%</th>
          </tr>
        </thead>
        <tbody part="tbody">
          ${this.data.map(row => {
            const cls = this.#changeClass(row.change);
            return html`
              <tr>
                <td>
                  <span class="symbol">${row.symbol}</span>${row.name
                    ? html`<span class="name">${row.name}</span>`
                    : nothing}
                </td>
                <td class="price">${this.#formatPrice(row.price)}</td>
                <td class="change ${cls}">
                  ${this.#renderArrow(row.change)}${this.#formatChange(row.change)}
                </td>
                <td class="pct ${cls}">${this.#formatPercent(row.changePercent)}</td>
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }
}
