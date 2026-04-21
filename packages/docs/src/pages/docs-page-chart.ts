import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import * as Plot from "@observablehq/plot";
import { chartSpec } from "@dui/chart";

// ── Sample data generators ──────────────────────────────────────────

function timeSeriesData(days = 90) {
  const data: { date: Date; value: number }[] = [];
  let v = 100;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    v += (Math.random() - 0.48) * 8;
    data.push({ date, value: Math.round(Math.max(0, v) * 100) / 100 });
  }
  return data;
}

function categoricalData() {
  return [
    { category: "Electronics", sales: 4200 },
    { category: "Clothing", sales: 3100 },
    { category: "Books", sales: 2400 },
    { category: "Home", sales: 1800 },
    { category: "Sports", sales: 1500 },
    { category: "Food", sales: 2800 },
  ];
}

function multiSeriesData(days = 60) {
  const series = ["Revenue", "Costs", "Profit"];
  const data: { date: Date; value: number; series: string }[] = [];
  const now = new Date();
  const bases: Record<string, number> = {
    Revenue: 200,
    Costs: 150,
    Profit: 50,
  };
  for (const s of series) {
    let v = bases[s];
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      v += (Math.random() - 0.48) * 10;
      data.push({
        date,
        value: Math.round(Math.max(0, v) * 100) / 100,
        series: s,
      });
    }
  }
  return data;
}

function scatterData(n = 80) {
  const data: { x: number; y: number; group: string }[] = [];
  const groups = ["A", "B", "C"];
  for (let i = 0; i < n; i++) {
    const g = groups[Math.floor(Math.random() * groups.length)];
    const cx = g === "A" ? 30 : g === "B" ? 60 : 45;
    const cy = g === "A" ? 70 : g === "B" ? 40 : 55;
    data.push({
      x: Math.round((cx + (Math.random() - 0.5) * 40) * 10) / 10,
      y: Math.round((cy + (Math.random() - 0.5) * 40) * 10) / 10,
      group: g,
    });
  }
  return data;
}

function stackedAreaData(days = 60) {
  const categories = ["Desktop", "Mobile", "Tablet"];
  const data: { date: Date; visitors: number; device: string }[] = [];
  const now = new Date();
  for (const cat of categories) {
    const base = cat === "Desktop" ? 500 : cat === "Mobile" ? 800 : 200;
    let v = base;
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      v += (Math.random() - 0.48) * 30;
      data.push({ date, visitors: Math.round(Math.max(10, v)), device: cat });
    }
  }
  return data;
}

function sparklineData(n = 30) {
  const data: { x: number; y: number }[] = [];
  let v = 50;
  for (let i = 0; i < n; i++) {
    v += (Math.random() - 0.48) * 8;
    data.push({ x: i, y: Math.round(Math.max(0, v) * 10) / 10 });
  }
  return data;
}

// ── Docs page ───────────────────────────────────────────────────────

@customElement("docs-page-chart")
export class DocsPageChart extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  static override styles = css`
    .sparkline-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-4);
    }
    .sparkline-card {
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-lg);
      padding: var(--space-3) var(--space-4);
    }
    .sparkline-card .label {
      font-size: var(--font-size-xs);
      color: var(--text-3);
      margin-bottom: var(--space-1);
    }
    .sparkline-card .value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-1);
      margin-bottom: var(--space-2);
    }
    .event-log {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      color: var(--text-2);
      background: var(--surface-1);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      padding: var(--space-2) var(--space-3);
      margin-top: var(--space-3);
      min-height: 2em;
    }

    /* ── Styling guide section ── */
    .chart-guide-section {
      margin-top: var(--space-14, 3.5rem);
      padding-top: var(--space-6);
      border-top: var(--border-width-medium, 2px) solid var(--border);
    }
    .chart-guide-section h2 {
      font-size: var(--font-size-xl, 1.25rem);
      font-weight: 700;
      letter-spacing: var(--letter-spacing-tight, -0.01em);
      color: var(--foreground);
      margin: 0 0 var(--space-2);
    }
    .chart-guide-section h3 {
      font-size: var(--font-size-base, 0.9375rem);
      font-weight: 600;
      color: var(--foreground);
      margin: var(--space-8) 0 var(--space-2);
    }
    .chart-guide-section p {
      font-size: var(--font-size-sm);
      color: var(--text-2);
      line-height: var(--line-height-relaxed, 1.625);
      margin: 0 0 var(--space-4);
      max-width: 40rem;
    }
    .chart-guide-section a {
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .chart-guide-section a:hover {
      text-decoration-thickness: 2px;
    }
    .chart-token-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-4);
    }
    .chart-token-table th {
      text-align: left;
      font-weight: 600;
      color: var(--text-2);
      font-size: var(--font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: var(--space-2) var(--space-3) var(--space-2) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }
    .chart-token-table td {
      padding: var(--space-2) var(--space-3) var(--space-2) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
      vertical-align: top;
    }
    .chart-token-table code {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      background: var(--surface-1);
      padding: 1px 5px;
      border-radius: var(--radius-sm);
    }
    .chart-aria-table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
      margin-bottom: var(--space-4);
    }
    .chart-aria-table th {
      text-align: left;
      font-weight: 600;
      color: var(--text-2);
      font-size: var(--font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: var(--space-2) var(--space-3) var(--space-2) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
    }
    .chart-aria-table td {
      padding: var(--space-2) var(--space-3) var(--space-2) 0;
      border-bottom: var(--border-width-thin) solid var(--border);
      vertical-align: top;
    }
    .chart-aria-table code {
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      background: var(--surface-1);
      padding: 1px 5px;
      border-radius: var(--radius-sm);
    }
  `;

  @state()
  accessor _lastInput: string = "Hover a bar to see events here…";

  // Generate data once, not on every render.
  #tsData = timeSeriesData();
  #catData = categoricalData();
  #multiData = multiSeriesData();
  #scatter = scatterData();
  #areaData = stackedAreaData();

  override render() {
    const tsData = this.#tsData;
    const catData = this.#catData;
    const multiData = this.#multiData;
    const scatter = this.#scatter;
    const areaData = this.#areaData;

    return html`
      <docs-page-layout tag="dui-chart">
        <!-- Line Chart with tooltip + active dot (uses chartSpec helper) -->
        <dui-docs-demo
          label="Line Chart — Interactive Tooltip"
          demo-width="100%"
        >
          <dui-chart
            .spec=${chartSpec({
              marks: [
                Plot.lineY(tsData, {
                  x: "date",
                  y: "value",
                  stroke: "var(--chart-color-1)",
                  strokeWidth: 2,
                }),
                Plot.dot(
                  tsData,
                  Plot.pointerX({
                    x: "date",
                    y: "value",
                    fill: "var(--chart-color-1)",
                    r: 4,
                    stroke: "var(--chart-bg, white)",
                    strokeWidth: 2,
                  }),
                ),
                Plot.tip(
                  tsData,
                  Plot.pointerX({
                    x: "date",
                    y: "value",
                  }),
                ),
                Plot.ruleY([0]),
              ],
              y: { grid: true, label: "Value" },
              x: { label: "Date" },
            })}
          ></dui-chart>
        </dui-docs-demo>

        <!-- Area Chart with crosshair (uses chartSpec helper) -->
        <dui-docs-demo label="Area Chart — Crosshair" demo-width="100%">
          <dui-chart
            .spec=${chartSpec({
              marks: [
                Plot.areaY(tsData, {
                  x: "date",
                  y: "value",
                  fill: "var(--chart-color-1)",
                  fillOpacity: 0.15,
                  curve: "natural",
                }),
                Plot.lineY(tsData, {
                  x: "date",
                  y: "value",
                  stroke: "var(--chart-color-1)",
                  strokeWidth: 2,
                  curve: "natural",
                }),
                Plot.crosshairX(tsData, { x: "date", y: "value" }),
                Plot.ruleY([0]),
              ],
              y: { grid: true, label: "Value" },
              x: { label: "Date" },
            })}
          ></dui-chart>
        </dui-docs-demo>

        <!-- Bar Chart with tooltip -->
        <dui-docs-demo label="Bar Chart — Hover Tooltip" demo-width="100%">
          <dui-chart
            .spec=${{
              marks: [
                Plot.barY(catData, {
                  x: "category",
                  y: "sales",
                  fill: "var(--chart-color-1)",
                  sort: { x: "-y" },
                  tip: true,
                  r: 3,
                  paddingInner: 10,
                }),
                Plot.ruleY([0], { strokeWidth: 0 }),
              ],
              x: { label: null },
              y: { grid: true, label: "Sales ($)" },
              style: { background: "transparent" },
            }}
            @dui-chart-input=${(e: CustomEvent) => {
              const v = e.detail?.value;
              if (v) {
                this._lastInput = `${v.category}: $${v.sales.toLocaleString()}`;
              } else {
                this._lastInput = "Hover a bar to see events here…";
              }
            }}
          ></dui-chart>
          <div class="event-log">${this._lastInput}</div>
        </dui-docs-demo>

        <!-- Stacked Area Chart with tooltip -->
        <dui-docs-demo label="Stacked Area Chart" demo-width="100%">
          <dui-chart
            .spec=${{
              marks: [
                Plot.areaY(
                  areaData,
                  Plot.stackY({
                    x: "date",
                    y: "visitors",
                    fill: "device",
                    fillOpacity: 0.6,
                    tip: true,
                  }),
                ),
                Plot.ruleY([0]),
              ],
              color: {
                label: "Device",
                legend: true,
                range: [
                  "var(--chart-color-1)",
                  "var(--chart-color-2)",
                  "var(--chart-color-3)",
                ],
              },
              x: { label: "Date" },
              y: { grid: true, label: "Visitors" },
              style: { background: "transparent" },
            }}
          ></dui-chart>
        </dui-docs-demo>

        <!-- Multi-series Line Chart with tooltip -->
        <dui-docs-demo label="Multi-series Line Chart" demo-width="100%">
          <dui-chart
            .spec=${{
              marks: [
                Plot.lineY(multiData, {
                  x: "date",
                  y: "value",
                  stroke: "series",
                  strokeWidth: 2,
                }),
                Plot.tip(multiData, Plot.pointer({ x: "date", y: "value" })),
                Plot.dot(
                  multiData,
                  Plot.pointer({
                    x: "date",
                    y: "value",
                    stroke: "series",
                    r: 4,
                  }),
                ),
                Plot.ruleY([0]),
              ],
              color: {
                legend: true,
                range: [
                  "var(--chart-color-1)",
                  "var(--chart-color-2)",
                  "var(--chart-color-4)",
                ],
              },
              y: { grid: true, label: "Amount ($)" },
              style: { background: "transparent" },
            }}
          ></dui-chart>
        </dui-docs-demo>

        <!-- Scatter Plot with tooltip -->
        <dui-docs-demo label="Scatter Plot — Hover Details" demo-width="100%">
          <dui-chart
            .spec=${{
              marks: [
                Plot.dot(scatter, {
                  x: "x",
                  y: "y",
                  fill: "group",
                  fillOpacity: 0.7,
                  r: 5,
                  tip: true,
                }),
              ],
              color: {
                legend: true,
                range: [
                  "var(--chart-color-1)",
                  "var(--chart-color-3)",
                  "var(--chart-color-5)",
                ],
              },
              x: { grid: true, label: "X" },
              y: { grid: true, label: "Y" },
              style: { background: "transparent" },
            }}
          ></dui-chart>
        </dui-docs-demo>

        <!-- Sparklines -->
        <dui-docs-demo label="Sparkline Variant" demo-width="100%">
          <div class="sparkline-grid">
            ${["Revenue", "Users", "Conversion"].map(
              (label) => html`
                <div class="sparkline-card">
                  <div class="label">${label}</div>
                  <div class="value">
                    ${label === "Revenue"
                      ? "$12.4k"
                      : label === "Users"
                        ? "1,847"
                        : "3.2%"}
                  </div>
                  <dui-chart
                    variant="sparkline"
                    .spec=${{
                      height: 40,
                      axis: null,
                      margin: 0,
                      marginTop: 2,
                      marginBottom: 2,
                      marks: [
                        Plot.areaY(sparklineData(), {
                          x: "x",
                          y: "y",
                          fill: "var(--chart-color-1)",
                          fillOpacity: 0.15,
                          curve: "natural",
                        }),
                        Plot.lineY(sparklineData(), {
                          x: "x",
                          y: "y",
                          stroke: "var(--chart-color-1)",
                          strokeWidth: 1.5,
                          curve: "natural",
                        }),
                      ],
                      style: { background: "transparent" },
                    }}
                  ></dui-chart>
                </div>
              `,
            )}
          </div>
        </dui-docs-demo>

        <!-- Horizontal Bar Chart -->
        <dui-docs-demo label="Horizontal Bar Chart" demo-width="100%">
          <dui-chart
            .spec=${{
              marks: [
                Plot.barX(catData, {
                  x: "sales",
                  y: "category",
                  fill: "var(--chart-color-1)",
                  sort: { y: "-x" },
                  tip: true,
                }),
                Plot.ruleX([0]),
              ],
              y: { label: null },
              x: { grid: true, label: "Sales ($)" },
              marginLeft: 80,
              style: { background: "transparent" },
            }}
          ></dui-chart>
        </dui-docs-demo>

        <!-- ════════════════════════════════════════════════════════ -->
        <!-- Styling Guide                                          -->
        <!-- ════════════════════════════════════════════════════════ -->
        <div class="chart-guide-section">
          <h2>Styling</h2>
          <p>
            Charts can be styled at three levels:
            <strong>Plot spec options</strong> on individual marks,
            <strong>DUI theme tokens</strong> (CSS custom properties), and
            <strong>theme CSS</strong>
            targeting Plot's SVG structure. Most styling is done through the
            spec.
          </p>
        </div>

        <!-- Styled bar chart -->
        <dui-docs-demo
          label="Styled Bar Chart — Rounded Bars, Soft Baseline"
          demo-width="100%"
        >
          <dui-chart
            .spec=${{
              marks: [
                Plot.barY(catData, {
                  x: "category",
                  y: "sales",
                  fill: "var(--chart-color-1)",
                  rx: 4,
                  sort: { x: "-y" },
                  tip: true,
                }),
                Plot.ruleY([0], { stroke: "var(--border)", strokeWidth: 0.5 }),
              ],
              x: { label: null, tickSize: 0 },
              y: { grid: true, label: null, tickFormat: "s" },
              style: { background: "transparent" },
            }}
          ></dui-chart>
        </dui-docs-demo>

        <!-- Token override demo -->
        <dui-docs-demo label="Token Overrides — Per-Instance" demo-width="100%">
          <dui-chart
            style="--chart-color-1: oklch(0.65 0.15 150); --chart-axis-color: var(--text-3); --chart-grid-color: oklch(from var(--border) l c h / 0.3);"
            .spec=${{
              marks: [
                Plot.lineY(tsData, {
                  x: "date",
                  y: "value",
                  stroke: "var(--chart-color-1)",
                  strokeWidth: 2,
                  curve: "natural",
                }),
                Plot.areaY(tsData, {
                  x: "date",
                  y: "value",
                  fill: "var(--chart-color-1)",
                  fillOpacity: 0.1,
                  curve: "natural",
                }),
                Plot.dot(
                  tsData,
                  Plot.pointerX({
                    x: "date",
                    y: "value",
                    fill: "var(--chart-color-1)",
                    r: 4,
                    stroke: "var(--chart-bg, white)",
                    strokeWidth: 2,
                  }),
                ),
                Plot.tip(tsData, Plot.pointerX({ x: "date", y: "value" })),
                Plot.ruleY([0]),
              ],
              y: { grid: true, label: null },
              x: { label: null },
              style: { background: "transparent" },
            }}
          ></dui-chart>
        </dui-docs-demo>

        <div
          class="chart-guide-section"
          style="border: none; margin-top: var(--space-8); padding-top: 0;"
        >
          <h3>1. Plot spec options</h3>
          <p>
            Every mark accepts styling options directly. This is the primary way
            to control individual chart elements. See the
            <a
              href="https://observablehq.com/plot/features/marks"
              target="_blank"
              rel="noopener"
              >marks overview</a
            >
            for the full list.
          </p>
          <p>
            Common per-mark options:
            <code>fill</code>, <code>stroke</code>, <code>strokeWidth</code>,
            <code>fillOpacity</code>, <code>rx</code> (bar rounding),
            <code>r</code> (dot radius), <code>curve</code> (line
            interpolation), <code>tip: true</code> (quick tooltip). Note: the
            <a
              href="https://observablehq.com/plot/marks/tip"
              target="_blank"
              rel="noopener"
              >tip mark</a
            >
            draws its background as an SVG <code>&lt;path&gt;</code>. DUI
            replaces Plot's SVG tooltip with an HTML overlay
            (<code>::part(tooltip)</code>) that supports full CSS styling
            including <code>border-radius</code>, <code>backdrop-filter</code>,
            and transitions.
          </p>
          <p>
            Common axis/scale options:
            <code>label</code>, <code>grid</code>, <code>ticks</code>,
            <code>tickSize</code>, <code>tickFormat</code> (transform display
            labels without changing data keys), <code>line</code> (show/hide
            axis line), <code>domain</code>, <code>padding</code>. See
            <a
              href="https://observablehq.com/plot/features/scales"
              target="_blank"
              rel="noopener"
              >scales docs</a
            >.
          </p>
          <p>
            Mark-specific docs:
            <a
              href="https://observablehq.com/plot/marks/bar"
              target="_blank"
              rel="noopener"
              >bar</a
            >,
            <a
              href="https://observablehq.com/plot/marks/line"
              target="_blank"
              rel="noopener"
              >line</a
            >,
            <a
              href="https://observablehq.com/plot/marks/area"
              target="_blank"
              rel="noopener"
              >area</a
            >,
            <a
              href="https://observablehq.com/plot/marks/dot"
              target="_blank"
              rel="noopener"
              >dot</a
            >,
            <a
              href="https://observablehq.com/plot/marks/rule"
              target="_blank"
              rel="noopener"
              >rule</a
            >,
            <a
              href="https://observablehq.com/plot/marks/tip"
              target="_blank"
              rel="noopener"
              >tip</a
            >,
            <a
              href="https://observablehq.com/plot/interactions/crosshair"
              target="_blank"
              rel="noopener"
              >crosshair</a
            >,
            <a
              href="https://observablehq.com/plot/interactions/pointer"
              target="_blank"
              rel="noopener"
              >pointer</a
            >.
          </p>

          <h3>2. DUI theme tokens</h3>
          <p>
            These CSS custom properties are set by the default theme and cascade
            into the chart's shadow DOM. Override them per-instance via
            <code>style</code> or globally in a custom theme.
          </p>
          <table class="chart-token-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--chart-color-1</code></td>
                <td><code>var(--accent)</code></td>
                <td>Primary series color</td>
              </tr>
              <tr>
                <td><code>--chart-color-2</code> – <code>8</code></td>
                <td>hue-rotated accent</td>
                <td>Additional series colors</td>
              </tr>
              <tr>
                <td><code>--chart-bg</code></td>
                <td><code>transparent</code></td>
                <td>Chart background</td>
              </tr>
              <tr>
                <td><code>--chart-grid-color</code></td>
                <td><code>var(--border)</code></td>
                <td>Grid line color</td>
              </tr>
              <tr>
                <td><code>--chart-axis-color</code></td>
                <td><code>var(--text-2)</code></td>
                <td>Axis text &amp; lines</td>
              </tr>
              <tr>
                <td><code>--chart-font-family</code></td>
                <td><code>var(--font-sans)</code></td>
                <td>All chart text</td>
              </tr>
              <tr>
                <td><code>--chart-font-size</code></td>
                <td><code>var(--font-size-xs)</code></td>
                <td>Tick label size</td>
              </tr>
            </tbody>
          </table>

          <h3>Tooltip tokens</h3>
          <p>
            The HTML tooltip overlay is styled via these tokens. Override
            per-instance or globally. You can also use
            <code>::part(tooltip)</code> from outside.
          </p>
          <table class="chart-token-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--chart-tooltip-bg</code></td>
                <td><code>var(--surface-1)</code></td>
                <td>Tooltip background</td>
              </tr>
              <tr>
                <td><code>--chart-tooltip-color</code></td>
                <td><code>var(--text-1)</code></td>
                <td>Tooltip text color</td>
              </tr>
              <tr>
                <td><code>--chart-tooltip-border</code></td>
                <td><code>var(--border)</code></td>
                <td>Tooltip border color</td>
              </tr>
              <tr>
                <td><code>--chart-tooltip-radius</code></td>
                <td><code>var(--radius-md)</code></td>
                <td>Tooltip corner radius</td>
              </tr>
              <tr>
                <td><code>--chart-tooltip-padding</code></td>
                <td><code>8px 12px</code></td>
                <td>Tooltip padding</td>
              </tr>
              <tr>
                <td><code>--chart-tooltip-font-size</code></td>
                <td><code>var(--chart-font-size)</code></td>
                <td>Tooltip font size</td>
              </tr>
              <tr>
                <td><code>--chart-tooltip-line-height</code></td>
                <td><code>1.5</code></td>
                <td>Tooltip line height</td>
              </tr>
            </tbody>
          </table>

          <h3>3. Theme CSS (class &amp; aria-label selectors)</h3>
          <p>
            Inside a custom theme, you can target Plot's SVG structure through
            <code>[part="root"]</code> descendant selectors. The component
            automatically adds CSS classes (e.g. <code>.chart-bar</code>,
            <code>.chart-x-axis</code>) derived from each element's
            <code>aria-label</code>. Both class and attribute selectors work.
            These selectors are <strong>not</strong> available from outside the
            component (CSS <code>::part()</code> does not allow descendant
            combinators).
          </p>
          <table class="chart-aria-table">
            <thead>
              <tr>
                <th>CSS class</th>
                <th>aria-label</th>
                <th>SVG element</th>
                <th>What it is</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>.chart-x-axis-tick-label</code></td>
                <td><code>x-axis tick label</code></td>
                <td><code>&lt;text&gt;</code></td>
                <td>X axis label text</td>
              </tr>
              <tr>
                <td><code>.chart-y-axis-tick-label</code></td>
                <td><code>y-axis tick label</code></td>
                <td><code>&lt;text&gt;</code></td>
                <td>Y axis label text</td>
              </tr>
              <tr>
                <td><code>.chart-x-grid</code> / <code>.chart-y-grid</code></td>
                <td><code>x-grid</code> / <code>y-grid</code></td>
                <td><code>&lt;line&gt;</code></td>
                <td>Grid lines</td>
              </tr>
              <tr>
                <td><code>.chart-bar</code></td>
                <td><code>bar</code></td>
                <td><code>&lt;rect&gt;</code></td>
                <td>Bar rectangles</td>
              </tr>
              <tr>
                <td><code>.chart-line</code></td>
                <td><code>line</code></td>
                <td><code>&lt;path&gt;</code></td>
                <td>Line paths</td>
              </tr>
              <tr>
                <td><code>.chart-area</code></td>
                <td><code>area</code></td>
                <td><code>&lt;path&gt;</code></td>
                <td>Area fills</td>
              </tr>
              <tr>
                <td><code>.chart-dot</code></td>
                <td><code>dot</code></td>
                <td><code>&lt;circle&gt;</code></td>
                <td>Dot circles</td>
              </tr>
              <tr>
                <td><code>.chart-rule</code></td>
                <td><code>rule</code></td>
                <td><code>&lt;line&gt;</code></td>
                <td>Reference lines</td>
              </tr>
              <tr>
                <td><code>.chart-tip</code></td>
                <td><code>tip</code></td>
                <td><code>&lt;path&gt;</code> + <code>&lt;text&gt;</code></td>
                <td>Tooltip (hidden; HTML overlay used instead)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </docs-page-layout>
    `;
  }
}
