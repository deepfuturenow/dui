import { LitElement, html, css } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement, state } from "lit/decorators.js";
import * as Plot from "@observablehq/plot";
import { chartSpec } from "@dui/chart";

/* ── Types ── */

interface PopRecord {
  age: number;
  sex: string;
  category: string;
  population: number;
}

const TRANSLATIONS: Record<string, string> = {
  ledig: "Single",
  verheiratet: "Married",
  geschieden: "Divorced",
  verwitwet: "Widowed",
};

/* ── Component ── */

@customElement("block-analytics")
export class BlockAnalytics extends LitElement {
  static override styles = [blockBase, css`
    :host {
      padding: var(--space-5);
      overflow: hidden;
    }

    .header {
      margin-bottom: var(--space-4);
    }

    .title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--space-0_5);
    }

    .subtitle {
      font-size: var(--font-size-xs);
      color: var(--text-2);
      margin: 0;
    }

    .chart-wrap {
      margin: 0 calc(-1 * var(--space-3));
      overflow: hidden;
    }

    dui-chart {
      display: block;
      width: 100%;
    }
  `];

  @state()
  accessor #data: PopRecord[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.#loadData();
  }

  async #loadData(): Promise<void> {
    try {
      const res = await fetch("/data/population.csv");
      const text = await res.text();
      const lines = text.trim().split("\n");
      // Skip header: age,sex,category,population
      this.#data = lines.slice(1).map((line) => {
        const [age, sex, category, population] = line.split(",");
        return {
          age: +age,
          sex,
          category,
          population: +population,
        };
      });
    } catch {
      // Silent fail — chart just won't render
    }
  }

  override render() {
    if (!this.#data.length) {
      return html`
        <div class="header">
          <p class="title">Population Pyramid</p>
          <p class="subtitle">Loading…</p>
        </div>
      `;
    }

    return html`
      <div class="header">
        <p class="title">Population Pyramid</p>
        <p class="subtitle">Germany — by age, sex, and marital status</p>
      </div>

      <div class="chart-wrap">
        <dui-chart
          .spec=${chartSpec({
            height: 380,
            x: {
              label: "← men · population (thousands) · women →",
              labelAnchor: "center",
              tickFormat: Math.abs,
            },
            y: { grid: true, label: null },
            color: {
              domain: ["ledig", "verheiratet", "geschieden", "verwitwet"],
              range: [
                "var(--chart-color-1)",
                "var(--chart-color-2)",
                "var(--chart-color-3)",
                "var(--chart-color-4)",
              ],
              legend: true,
              tickFormat: (d: string) => TRANSLATIONS[d] ?? d,
            },
            marks: [
              Plot.areaX(this.#data, {
                x: (d: PopRecord) =>
                  d.population * (d.sex === "M" ? -1 : 1),
                y: "age",
                z: (d: PopRecord) => `${d.sex},${d.category}`,
                fill: "category",
              }),
              Plot.ruleX([0]),
              Plot.ruleY([0]),
            ],
            marginLeft: 40,
            marginRight: 20,
            marginBottom: 36,
          })}
        ></dui-chart>
      </div>
    `;
  }
}
