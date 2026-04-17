import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";
import { DuiSeparator } from "@dui/components/separator";

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
    transition: background var(--duration-fast) ease;
  }

  article:hover {
    background: var(--surface-2);
  }

  /* ── Top row: entity + score ── */
  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .entity-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-0_5);
    min-width: 0;
  }

  .entity {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .subtitle {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-2);
  }

  .score-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-0_5);
    flex-shrink: 0;
  }

  .score {
    font-family: var(--font-mono);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-tight);
    color: var(--foreground);
  }

  .score-label {
    font-family: var(--font-sans);
    font-size: var(--font-size-2xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-widest);
    text-transform: uppercase;
    line-height: var(--line-height-normal);
    color: var(--text-3);
  }

  /* ── Sub-metrics row ── */
  .sub-metrics {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    flex-wrap: wrap;
  }

  .sub-metrics:not(:has(::slotted(*))) {
    display: none;
  }

  /* ── Actions ── */
  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .actions:not(:has(::slotted(*))) {
    display: none;
  }
`;

/**
 * `<dui-score-item>` — An entity with a prominent score and optional sub-metric breakdown.
 *
 * Displays an entity name with an optional subtitle on the left, and a large score
 * with an optional label on the right. Below the main row, slotted sub-metrics
 * provide additional breakdowns.
 *
 * @slot sub-metrics - Additional metric breakdowns below the main row.
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 * @csspart entity - The entity name.
 * @csspart score - The score value.
 * @csspart sub-metrics - The sub-metrics row.
 */
export class DuiScoreItem extends LitElement {
  static tagName = "dui-score-item" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge, DuiSeparator];

  /** Entity name (e.g. country, department, agent). */
  @property() accessor entity = "";

  /** Secondary context below the entity name. */
  @property() accessor subtitle = "";

  /** Prominent score value (e.g. "87", "A+", "9.4"). */
  @property() accessor score = "";

  /** Label beneath the score (e.g. "Risk Score", "Rating"). */
  @property({ attribute: "score-label" }) accessor scoreLabel = "";

  /** Severity level — maps to badge for optional tagging (critical | high | medium | low). */
  @property() accessor severity = "";

  override render(): TemplateResult {
    return html`
      <article part="article">
        <div class="top">
          <div class="entity-group">
            <span class="entity" part="entity">${this.entity}</span>
            ${this.subtitle
              ? html`<span class="subtitle">${this.subtitle}</span>`
              : nothing}
          </div>

          <div class="score-group">
            <span class="score" part="score">${this.score}</span>
            ${this.scoreLabel
              ? html`<span class="score-label">${this.scoreLabel}</span>`
              : nothing}
          </div>
        </div>

        <div class="sub-metrics" part="sub-metrics">
          <slot name="sub-metrics"></slot>
        </div>

        <div class="actions">
          <slot name="actions"></slot>
        </div>
      </article>
    `;
  }
}
