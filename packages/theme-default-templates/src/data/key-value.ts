import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";

const styles = css`
  :host {
    display: block;
  }

  .pair {
    display: flex;
    flex-direction: column;
    gap: var(--space-0_5);
  }

  :host([layout="inline"]) .pair {
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .label {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-2);
  }

  .value {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
  }

  :host([layout="inline"]) .value {
    text-align: end;
  }

  .description {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-3);
    margin: 0;
  }
`;

/**
 * `<dui-key-value>` — A label–value pair for metadata display.
 *
 * Renders a muted label and a prominent value. Supports two layouts:
 * `stacked` (default — label above value) and `inline` (label left, value right).
 *
 * Compose inside `<dui-key-value-group>` for grid layouts.
 *
 * @csspart pair - The outer container.
 * @csspart label - The label text.
 * @csspart value - The value text.
 * @csspart description - The description text.
 */
export class DuiKeyValue extends LitElement {
  static tagName = "dui-key-value" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [];

  /** The label text (e.g. "Status", "Region", "Created"). */
  @property() accessor label = "";

  /** The value text (e.g. "Active", "North America", "Jan 15, 2025"). */
  @property() accessor value = "";

  /** Optional supporting description below the value. */
  @property() accessor description = "";

  /** Layout mode: "stacked" (label above value) or "inline" (side by side). */
  @property({ reflect: true }) accessor layout: "stacked" | "inline" = "stacked";

  override render(): TemplateResult {
    return html`
      <div class="pair" part="pair">
        <span class="label" part="label">${this.label}</span>
        <span class="value" part="value">
          <slot>${this.value}</slot>
        </span>
      </div>
      ${this.description
        ? html`<p class="description" part="description">${this.description}</p>`
        : nothing}
    `;
  }
}
