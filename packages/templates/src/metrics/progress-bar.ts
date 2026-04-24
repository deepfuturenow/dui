import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import "@dui/components/progress";

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-1_5);
    padding: var(--space-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
  }

  /* ── Top row: label + value ── */
  .top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-1_5);
  }

  .label {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .value-text {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-snug);
    color: var(--text-2);
    flex-shrink: 0;
  }

  /* ── Description ── */
  .description {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-2);
    margin: 0;
  }

  /* ── Actions ── */
  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding-top: var(--space-1);
  }

  .actions[hidden] {
    display: none;
  }
`;

/**
 * `<dui-progress-bar>` — A labeled capacity/completion indicator with a progress bar.
 *
 * Wraps `<dui-progress>` with a label row showing the metric name and value.
 * Supports a description for extra context.
 *
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 * @csspart label - The metric label.
 * @csspart value - The value/percentage text.
 * @csspart progress - The progress bar element.
 * @csspart description - The description text.
 */
export class DuiProgressBar extends LitElement {
  static tagName = "dui-progress-bar" as const;
  static override styles = [base, styles];
  /** Metric label (e.g. "CPU Usage", "Storage", "Quota"). */
  @property() accessor label = "";

  /** Current value (0–max). */
  @property({ type: Number }) accessor value = 0;

  /** Maximum value. */
  @property({ type: Number }) accessor max = 100;

  /** Custom display text (e.g. "12.4 GB / 50 GB"). Overrides auto percentage. */
  @property({ attribute: "value-text" }) accessor valueText = "";

  /** Supporting description text. */
  @property() accessor description = "";

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const pct = this.max > 0 ? Math.round((this.value / this.max) * 100) : 0;
    const displayText = this.valueText || `${pct}%`;

    return html`
      <article part="article">
        <div class="top">
          ${this.label
            ? html`<span class="label" part="label">${this.label}</span>`
            : nothing}
          <span class="value-text" part="value">${displayText}</span>
        </div>

        <dui-progress
          part="progress"
          .value=${this.value}
          .max=${this.max}
        ></dui-progress>

        ${this.description
          ? html`<p class="description" part="description">${this.description}</p>`
          : nothing}

        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </article>
    `;
  }
}

customElements.define(DuiProgressBar.tagName, DuiProgressBar);
