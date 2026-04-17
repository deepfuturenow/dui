import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import "./docs-template-layout.ts";

@customElement("docs-page-market-table")
export class DocsPageMarketTable extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const stockData = [
      { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 3.24, changePercent: 1.81 },
      { symbol: "MSFT", name: "Microsoft", price: 374.51, change: -2.18, changePercent: -0.58 },
      { symbol: "GOOGL", name: "Alphabet", price: 141.80, change: 0.95, changePercent: 0.67 },
      { symbol: "AMZN", name: "Amazon", price: 178.25, change: -5.32, changePercent: -2.90 },
      { symbol: "NVDA", name: "NVIDIA", price: 875.28, change: 22.15, changePercent: 2.60 },
      { symbol: "TSLA", name: "Tesla", price: 248.42, change: 0, changePercent: 0 },
    ];

    const cryptoData = [
      { symbol: "BTC", name: "Bitcoin", price: 67842.50, change: 1250.30, changePercent: 1.88 },
      { symbol: "ETH", name: "Ethereum", price: 3456.12, change: -89.45, changePercent: -2.52 },
      { symbol: "SOL", name: "Solana", price: 142.78, change: 8.92, changePercent: 6.66 },
      { symbol: "ADA", name: "Cardano", price: 0.4521, change: -0.0132, changePercent: -2.84 },
    ];

    const forexData = [
      { symbol: "EUR/USD", price: 1.0842, change: 0.0023, changePercent: 0.21 },
      { symbol: "GBP/USD", price: 1.2651, change: -0.0018, changePercent: -0.14 },
      { symbol: "USD/JPY", price: 154.32, change: 0.85, changePercent: 0.55 },
    ];

    return html`
      <docs-template-layout tag="dui-market-table">

        <dui-docs-demo label="Equities">
          <div style="max-width: 560px;">
            <dui-market-table .data=${stockData}></dui-market-table>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Crypto (high precision)">
          <div style="max-width: 560px;">
            <dui-market-table .data=${cryptoData} price-precision="2"></dui-market-table>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Forex (no currency symbol, 4 decimal places)">
          <div style="max-width: 560px;">
            <dui-market-table .data=${forexData} currency-symbol="" price-precision="4"></dui-market-table>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Empty state">
          <div style="max-width: 560px;">
            <dui-market-table .data=${[]} empty-text="Market data unavailable"></dui-market-table>
          </div>
        </dui-docs-demo>

      </docs-template-layout>
    `;
  }
}
