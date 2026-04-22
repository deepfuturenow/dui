import { css, html, LitElement, nothing, svg, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";

/** Severity → color token mapping. */
const SEVERITY_COLORS: Record<string, string> = {
  critical: "var(--destructive)",
  high: "var(--destructive-text)",
  medium: "var(--accent)",
  low: "var(--accent-text)",
  info: "var(--text-3)",
};

/** Trend direction → arrow path. */
const TREND_ARROWS: Record<string, string> = {
  up: "M12 19V5M5 12l7-7 7 7",
  down: "M12 5v14M19 12l-7 7-7-7",
  stable: "M5 12h14",
};

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
  }

  /* ── Arc gauge ── */
  .gauge {
    position: relative;
    width: 9rem;
    height: 5.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .gauge svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .center-value {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-0_5);
    padding-bottom: var(--space-1);
  }

  .center-number {
    /* font-family: var(--font-mono); */
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-none);
    color: var(--foreground);
  }

  .severity-label {
    font-family: var(--font-sans);
    font-size: var(--text-2xs);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-widest);
    text-transform: uppercase;
    line-height: var(--line-height-none);
  }

  /* ── Label + trend row ── */
  .label {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    text-align: center;
  }

  .trend-row {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
  }

  /* ── Actions ── */
  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin-top: var(--space-1);
  }

  .actions[hidden] {
    display: none;
  }
`;

/**
 * `<dui-risk-gauge>` — A semicircular arc gauge with a central value,
 * severity label, and optional trend indicator.
 *
 * The arc fills proportionally to `value` (0–100). The `severity` prop
 * controls the arc color (critical, high, medium, low, info).
 *
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 * @csspart gauge - The SVG gauge area.
 * @csspart value - The central value text.
 * @csspart label - The metric label.
 * @csspart trend - The trend row.
 */
export class DuiRiskGauge extends LitElement {
  static tagName = "dui-risk-gauge" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [];

  /** Metric label displayed below the gauge. */
  @property() accessor label = "";

  /** Gauge value (0–100). */
  @property({ type: Number }) accessor value = 0;

  /** Severity level — determines arc color (critical | high | medium | low | info). */
  @property() accessor severity = "";

  /** Trend text (e.g. "+5 pts", "-12%"). */
  @property() accessor trend = "";

  /** Trend direction (up | down | stable). */
  @property({ attribute: "trend-direction" }) accessor trendDirection = "";

  #renderArc(): TemplateResult {
    // Semi-circle arc: 180° from left to right
    // viewBox centers a semicircle with radius 40, stroke-width 8
    const R = 40;
    const CX = 50;
    const CY = 50;
    const circumference = Math.PI * R; // half circle
    const clamped = Math.max(0, Math.min(100, this.value));
    const filled = (clamped / 100) * circumference;
    const sevColor = SEVERITY_COLORS[this.severity.toLowerCase()] ?? "var(--accent)";

    // Arc from (10,50) to (90,50) — a semicircle
    const arcPath = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`;

    return html`
      <svg viewBox="0 0 100 55" fill="none" part="gauge">
        ${svg`
          <!-- Track -->
          <path d="${arcPath}" stroke="var(--border)" stroke-width="8"
            stroke-linecap="round" fill="none" />
          <!-- Fill -->
          <path d="${arcPath}" stroke="${sevColor}" stroke-width="8"
            stroke-linecap="round" fill="none"
            stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference - filled}" />
        `}
      </svg>
    `;
  }

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const sevColor = SEVERITY_COLORS[this.severity.toLowerCase()] ?? "var(--accent)";
    const trendArrow = TREND_ARROWS[this.trendDirection.toLowerCase()];
    const trendColor =
      this.trendDirection === "up" ? "var(--destructive-text)"
      : this.trendDirection === "down" ? "var(--accent-text)"
      : "var(--text-3)";

    return html`
      <article part="article">
        <div class="gauge">
          ${this.#renderArc()}
          <div class="center-value">
            <span class="center-number" part="value">${this.value}</span>
            ${this.severity
              ? html`<span class="severity-label" style="color: ${sevColor}">${this.severity}</span>`
              : nothing}
          </div>
        </div>

        ${this.label
          ? html`<span class="label" part="label">${this.label}</span>`
          : nothing}

        ${this.trend && trendArrow
          ? html`<span class="trend-row" part="trend" style="color: ${trendColor}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                stroke-linejoin="round"><path d="${trendArrow}"/></svg>
              ${this.trend}
            </span>`
          : nothing}

        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </article>
    `;
  }
}
