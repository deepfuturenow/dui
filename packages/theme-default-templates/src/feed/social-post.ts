import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiAvatar } from "@dui/components/avatar";
import { DuiBadge } from "@dui/components/badge";

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

  /* ── Avatar ── */
  .avatar-slot {
    flex-shrink: 0;
  }

  .avatar-slot[hidden] {
    display: none;
  }

  /* ── Main content ── */
  .main {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
    flex: 1;
  }

  /* ── Header row ── */
  header {
    display: flex;
    align-items: baseline;
    gap: var(--space-1_5);
    min-width: 0;
  }

  .header-left {
    display: flex;
    align-items: baseline;
    gap: var(--space-1_5);
    min-width: 0;
    flex: 1;
    flex-wrap: wrap;
  }

  .author {
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

  .handle {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--text-3);
    white-space: nowrap;
  }

  .separator {
    color: var(--text-3);
    font-size: var(--font-size-xs);
  }

  .timestamp {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--text-3);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── Body ── */
  .body {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-1);
    margin-bottom: var(--space-1);
    white-space: pre-line;
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
 * `<dui-social-post>` — A social signal card for monitoring dashboards.
 *
 * Displays an author, handle, timestamp, body text, and optional source
 * badge and avatar. Useful for social media monitoring feeds.
 *
 * @slot avatar - Profile picture (dui-avatar recommended).
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer article container.
 * @csspart header - The author/handle/timestamp + source badge row.
 * @csspart body - The post body text.
 */
export class DuiSocialPost extends LitElement {
  static tagName = "dui-social-post" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiAvatar, DuiBadge];

  /** Display name of the post author. */
  @property() accessor author = "";

  /** Handle / username (e.g. "@analyst_jane"). */
  @property() accessor handle = "";

  /** Display timestamp (e.g. "2 min ago", "14:23 UTC"). */
  @property() accessor timestamp = "";

  /** Post body text. */
  @property() accessor body = "";

  /** Source platform label (e.g. "X", "Bluesky", "Telegram"). */
  @property() accessor source = "";

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    return html`
      <article part="article">
        <div class="avatar-slot" hidden>
          <slot name="avatar" @slotchange=${this.#onSlotChange}></slot>
        </div>

        <div class="main">
          <header part="header">
            <div class="header-left">
              ${this.author
                ? html`<span class="author">${this.author}</span>`
                : nothing}
              ${this.handle
                ? html`<span class="handle">${this.handle}</span>`
                : nothing}
              ${(this.author || this.handle) && this.timestamp
                ? html`<span class="separator">·</span>`
                : nothing}
              ${this.timestamp
                ? html`<time class="timestamp" part="timestamp">${this.timestamp}</time>`
                : nothing}
            </div>
            ${this.source
              ? html`<dui-badge variant="neutral" appearance="ghost">${this.source}</dui-badge>`
              : nothing}
          </header>

          ${this.body
            ? html`<p class="body" part="body">${this.body}</p>`
            : nothing}

          <div class="actions" hidden>
            <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
      </article>
    `;
  }
}
