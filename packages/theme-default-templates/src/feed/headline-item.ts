import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-0_5);
    padding: var(--space-1_5) var(--space-2);
    border-radius: var(--radius-sm);
    transition: background var(--duration-fast) ease;
  }

  article:hover {
    background: var(--surface-1);
  }

  .title {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    text-decoration: none;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: var(--space-1_5);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-3);
  }

  .separator {
    color: var(--text-3);
  }

  .actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .actions[hidden] {
    display: none;
  }
`;

/**
 * `<dui-headline-item>` — A minimal headline row: title, source, and timestamp.
 *
 * Designed for dense headline lists and news tickers where space is at a premium.
 * Renders as a single horizontal row with the title taking available space and
 * source + timestamp right-aligned.
 *
 * @slot actions - Optional trailing action buttons or links.
 * @csspart article - The outer article container.
 * @csspart title - The headline title text.
 * @csspart meta - The source + timestamp row.
 */
export class DuiHeadlineItem extends LitElement {
  static tagName = "dui-headline-item" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [];

  /** Primary headline text. */
  @property() override accessor title = "";

  /** Source or publication name. */
  @property() accessor source = "";

  /** Display timestamp (e.g. "2 min ago", "14:23 UTC"). */
  @property() accessor timestamp = "";

  /** Optional URL — when set, the title renders as a link. */
  @property() accessor href = "";

  /** Toggle hidden on slot wrapper when slotted content changes. */
  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const titleContent = this.href
      ? html`<a href=${this.href} class="title" part="title">${this.title}</a>`
      : html`<span class="title" part="title">${this.title}</span>`;

    return html`
      <article part="article">
        ${titleContent}

        ${this.source || this.timestamp
          ? html`
            <div class="meta" part="meta">
              ${this.source ? html`<span>${this.source}</span>` : nothing}
              ${this.source && this.timestamp
                ? html`<span class="separator">·</span>`
                : nothing}
              ${this.timestamp
                ? html`<time>${this.timestamp}</time>`
                : nothing}
            </div>`
          : nothing}

        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </article>
    `;
  }
}
