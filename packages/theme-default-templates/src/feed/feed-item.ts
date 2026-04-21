import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";

/**
 * Severity → badge variant + appearance mapping.
 * Uses the default theme's variant vocabulary.
 */
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
    flex-direction: column;
    gap: var(--space-0_5);
    padding: var(--space-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
    transition: background var(--duration-fast) ease;
  }

  article:hover {
    background: var(--surface-2);
  }

  header {
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    flex: 1;
  }

  .badges {
    display: flex;
    align-items: center;
    gap: var(--space-1_5);
    flex-shrink: 0;
    justify-self: flex-end;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-2);
  }

  .meta-separator {
    color: var(--text-3);
  }

  .body {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-1);
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
 * `<dui-feed-item>` — An event card for feeds and monitoring dashboards.
 *
 * Renders a title, subtitle (source/location), timestamp, optional category
 * and severity badges, and an optional description body.
 *
 * @slot actions - Optional action buttons or links below the body.
 * @csspart article - The outer article container.
 * @csspart header - The title + badges row.
 * @csspart meta - The subtitle + timestamp row.
 * @csspart body - The description paragraph.
 */
export class DuiFeedItem extends LitElement {
  static tagName = "dui-feed-item" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge];

  /** Primary label for the event. */
  @property() override accessor title = "";

  /** Secondary context — location, source, or origin. */
  @property() accessor subtitle = "";

  /** Display timestamp (e.g. "2 min ago", "14:23 UTC"). */
  @property() accessor timestamp = "";

  /** Category label — renders as a neutral badge. */
  @property() accessor category = "";

  /** Severity level — maps to badge variant (critical | high | medium | low). */
  @property() accessor severity = "";

  /** Optional body text. */
  @property() accessor description = "";

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const sev = SEVERITY_MAP[this.severity.toLowerCase()];

    return html`
      <article part="article">
        <header part="header">
          <span class="title">${this.title}</span>
          <div class="badges">
            ${this.category
              ? html`<dui-badge appearance="soft">${this.category}</dui-badge>`
              : nothing}
            ${sev
              ? html`<dui-badge variant=${sev.variant} appearance=${sev.appearance}>${this.severity}</dui-badge>`
              : nothing}
          </div>
        </header>

        ${this.subtitle || this.timestamp
          ? html`
            <div class="meta" part="meta">
              ${this.subtitle ? html`<span>${this.subtitle}</span>` : nothing}
              ${this.subtitle && this.timestamp
                ? html`<span class="meta-separator">·</span>`
                : nothing}
              ${this.timestamp
                ? html`<time>${this.timestamp}</time>`
                : nothing}
            </div>`
          : nothing}

        ${this.description
          ? html`<p class="body" part="body">
              <slot name="description">${this.description}</slot>
            </p>`
          : nothing}

        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </article>
    `;
  }
}
