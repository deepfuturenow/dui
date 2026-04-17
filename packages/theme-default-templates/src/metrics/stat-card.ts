import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiIcon } from "@dui/components/icon";

/** Map trend direction to color tokens and arrow SVG paths. */
const TREND_CONFIG: Record<string, { color: string; path: string }> = {
  up: {
    color: "var(--accent-text)",
    path: "M12 19V5M5 12l7-7 7 7",
  },
  down: {
    color: "var(--destructive-text)",
    path: "M12 5v14M19 12l-7 7-7-7",
  },
  stable: {
    color: "var(--text-3)",
    path: "M5 12h14",
  },
};

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-4) var(--space-5);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
  }

  .label {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-2);
  }

  .value-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .value {
    font-family: var(--font-sans);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-tight);
    color: var(--foreground);
  }

  .trend {
    display: inline-flex;
    align-items: center;
    gap: var(--space-0_5);
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
  }

  .description {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-3);
    margin: 0;
  }

  /* Hide actions container when slot is empty */
  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-top: var(--space-2);
  }

  .actions:not(:has(::slotted(*))) {
    display: none;
  }
`;

/**
 * `<dui-stat-card>` — A single metric card displaying a label, prominent value,
 * optional trend indicator, and description text.
 *
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 * @csspart label - The metric label.
 * @csspart value - The metric value.
 * @csspart trend - The trend indicator.
 * @csspart description - The description text.
 */
export class DuiStatCard extends LitElement {
  static tagName = "dui-stat-card" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiIcon];

  /** Metric label (e.g. "Total Events", "Response Time"). */
  @property() accessor label = "";

  /** Primary metric value (e.g. "1,284", "$42.5K", "99.9%"). */
  @property() accessor value = "";

  /** Trend text (e.g. "+12%", "-3.2%", "0%"). */
  @property() accessor trend = "";

  /** Trend direction — determines arrow and color (up | down | stable). */
  @property({ attribute: "trend-direction" }) accessor trendDirection = "";

  /** Supporting context text. */
  @property() accessor description = "";

  override render(): TemplateResult {
    const cfg = TREND_CONFIG[this.trendDirection.toLowerCase()];

    return html`
      <article part="article">
        ${this.label
          ? html`<span class="label" part="label">${this.label}</span>`
          : nothing}

        <div class="value-row">
          <span class="value" part="value">${this.value}</span>
          ${this.trend && cfg
            ? html`<span class="trend" part="trend" style="color: ${cfg.color}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                  stroke-linejoin="round"><path d="${cfg.path}"/></svg>
                ${this.trend}
              </span>`
            : nothing}
        </div>

        ${this.description
          ? html`<p class="description" part="description">${this.description}</p>`
          : nothing}

        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </article>
    `;
  }
}
