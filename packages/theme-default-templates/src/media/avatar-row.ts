import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiAvatar } from "@dui/components/avatar";
import { DuiScrollArea } from "@dui/components/scroll-area";

/** A single avatar entry in the row. */
export interface AvatarItem {
  /** Image URL for the avatar. */
  src?: string;
  /** Display name — used for alt text and fallback initials. */
  name: string;
  /** Optional label beneath the avatar (defaults to name). */
  label?: string;
}

const styles = css`
  :host {
    display: block;
  }

  .row {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-1) var(--space-0_5);
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1_5);
    flex-shrink: 0;
    min-width: 0;
  }

  .item dui-avatar {
    --avatar-size: var(--avatar-row-size, 3rem);
  }

  .label {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-none);
    color: var(--text-2);
    text-align: center;
    max-width: calc(var(--avatar-row-size, 3rem) + var(--space-4));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .empty {
    padding: var(--space-4);
    text-align: center;
    color: var(--text-3);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
  }
`;

/**
 * `<dui-avatar-row>` — A horizontal scrollable row of circular avatars with labels.
 *
 * Ideal for displaying teams, participants, agents, or any list of people/entities
 * in a compact horizontal strip. Scrolls horizontally when items overflow.
 *
 * @slot actions - Optional trailing action (e.g. an "Add" button).
 * @csspart row - The flex container holding avatar items.
 */
export class DuiAvatarRow extends LitElement {
  static tagName = "dui-avatar-row" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiAvatar, DuiScrollArea];

  /** Array of avatar items to display. */
  @property({ type: Array }) accessor data: AvatarItem[] = [];

  /** Text shown when data is empty. */
  @property({ attribute: "empty-text" }) accessor emptyText = "No items";

  /** Extract 1–2 character initials from a name. */
  #initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /** Toggle hidden on slot wrapper when slotted content changes. */
  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    if (this.data.length === 0) {
      return html`<div class="empty">${this.emptyText}</div>`;
    }

    return html`
      <dui-scroll-area orientation="horizontal">
        <div class="row" part="row">
          ${this.data.map(
            (item) => html`
              <div class="item">
                <dui-avatar
                  .src=${item.src ?? undefined}
                  alt=${item.name}
                >${this.#initials(item.name)}</dui-avatar>
                <span class="label">${item.label ?? item.name}</span>
              </div>
            `,
          )}
          <div hidden>
            <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
      </dui-scroll-area>
    `;
  }
}
