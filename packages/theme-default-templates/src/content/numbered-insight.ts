import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";

/** Severity → badge variant + appearance mapping. */
const SEVERITY_MAP: Record<string, { variant: string; appearance: string }> = {
  critical: { variant: "danger", appearance: "filled" },
  high: { variant: "danger", appearance: "ghost" },
  medium: { variant: "primary", appearance: "ghost" },
  low: { variant: "neutral", appearance: "ghost" },
};

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
    transition: background var(--duration-fast) ease;
  }

  article:hover {
    background: var(--surface-2);
  }

  .ordinal {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: var(--space-7);
    height: var(--space-7);
    border-radius: var(--radius-full);
    background: var(--accent-subtle);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--accent-text);
    line-height: var(--line-height-none);
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;
    min-width: 0;
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 0;
  }

  .title {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    flex: 1;
    min-width: 0;
  }

  .badges {
    display: flex;
    align-items: center;
    gap: var(--space-1_5);
    flex-shrink: 0;
  }

  .description {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-relaxed);
    color: var(--text-2);
    margin: 0;
  }

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
 * `<dui-numbered-insight>` — An ordinal-numbered insight with title, badges, and description.
 *
 * Use for ranked findings, prioritized recommendations, or numbered takeaways
 * in analysis panels. The ordinal number renders in a tinted circle for emphasis.
 *
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 * @csspart ordinal - The numbered circle.
 * @csspart title - The insight title.
 * @csspart description - The description text.
 */
export class DuiNumberedInsight extends LitElement {
  static tagName = "dui-numbered-insight" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge];

  /** Ordinal number (e.g. 1, 2, 3). */
  @property({ type: Number }) accessor ordinal = 1;

  /** Primary insight title. */
  @property() override accessor title = "";

  /** Category label — renders as a neutral badge. */
  @property() accessor category = "";

  /** Severity level — maps to badge variant (critical | high | medium | low). */
  @property() accessor severity = "";

  /** Descriptive body text. */
  @property() accessor description = "";

  /** Toggle hidden on slot wrapper when slotted content changes. */
  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const sev = SEVERITY_MAP[this.severity.toLowerCase()];

    return html`
      <article part="article">
        <span class="ordinal" part="ordinal">${this.ordinal}</span>

        <div class="content">
          <div class="title-row">
            <span class="title" part="title">${this.title}</span>
            <div class="badges">
              ${this.category
                ? html`<dui-badge appearance="soft">${this.category}</dui-badge>`
                : nothing}
              ${sev
                ? html`<dui-badge variant=${sev.variant} appearance=${sev.appearance}>${this.severity}</dui-badge>`
                : nothing}
            </div>
          </div>

          ${this.description
            ? html`<p class="description" part="description">${this.description}</p>`
            : nothing}

          <div class="actions" hidden>
            <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
      </article>
    `;
  }
}
