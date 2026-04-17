import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";
import { DuiSeparator } from "@dui/components/separator";
import { DuiIcon } from "@dui/components/icon";

const styles = css`
  :host {
    display: block;
  }

  article {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-4);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
  }

  header {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2_5);
    min-width: 0;
  }

  .header-icon {
    flex-shrink: 0;
    --icon-size: 1rem;
    --icon-color: var(--accent-text);
    margin-top: var(--space-0_5);
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-0_5);
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
    font-size: var(--font-size-sm);
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

  .meta {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-3);
  }

  .meta-separator {
    color: var(--text-3);
  }

  .body {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-relaxed);
    color: var(--text-1);
    margin: 0;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .actions[hidden] {
    display: none;
  }
`;

/**
 * `<dui-briefing-block>` — An AI-generated summary block with header, metadata, and body.
 *
 * Use for intelligence briefings, AI summaries, analysis blocks, or any authored
 * content that benefits from clear attribution and source metadata.
 *
 * @slot body - Rich body content (overrides body prop).
 * @slot actions - Optional action buttons or links below the body.
 * @csspart article - The outer container.
 * @csspart header - The icon + title + meta region.
 * @csspart title - The title text.
 * @csspart meta - The metadata row (source, timestamp).
 * @csspart body - The body text.
 */
export class DuiBriefingBlock extends LitElement {
  static tagName = "dui-briefing-block" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge, DuiSeparator, DuiIcon];

  /** Primary title for the briefing. */
  @property() override accessor title = "";

  /** Source or author attribution (e.g. "AI Analysis", "GPT-4o"). */
  @property() accessor source = "";

  /** Display timestamp (e.g. "2 min ago", "14:23 UTC"). */
  @property() accessor timestamp = "";

  /** Category or topic label — renders as a neutral badge. */
  @property() accessor category = "";

  /** Confidence level label — renders as a badge (e.g. "High", "Medium"). */
  @property() accessor confidence = "";

  /** Body text content. */
  @property() accessor body = "";

  /** Toggle hidden on slot wrapper when slotted content changes. */
  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const hasIcon = true; // always show the sparkle icon for AI content
    const hasMeta = this.source || this.timestamp;

    return html`
      <article part="article">
        <header part="header">
          ${hasIcon
            ? html`<dui-icon class="header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                  <path d="M20 3v4"/>
                  <path d="M22 5h-4"/>
                </svg>
              </dui-icon>`
            : nothing}
          <div class="header-content">
            <div class="title-row">
              <span class="title" part="title">${this.title}</span>
              <div class="badges">
                ${this.category
                  ? html`<dui-badge appearance="ghost">${this.category}</dui-badge>`
                  : nothing}
                ${this.confidence
                  ? html`<dui-badge variant="primary" appearance="ghost">${this.confidence}</dui-badge>`
                  : nothing}
              </div>
            </div>
            ${hasMeta
              ? html`<div class="meta" part="meta">
                  ${this.source ? html`<span>${this.source}</span>` : nothing}
                  ${this.source && this.timestamp
                    ? html`<span class="meta-separator">·</span>`
                    : nothing}
                  ${this.timestamp
                    ? html`<time>${this.timestamp}</time>`
                    : nothing}
                </div>`
              : nothing}
          </div>
        </header>

        ${this.body
          ? html`
            <dui-separator></dui-separator>
            <p class="body" part="body">
              <slot name="body">${this.body}</slot>
            </p>`
          : html`<slot name="body"></slot>`}

        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </article>
    `;
  }
}
