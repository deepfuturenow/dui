import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";

/** A single media item in the grid. */
export interface MediaItem {
  /** Image or video thumbnail URL. */
  src: string;
  /** Alt text for accessibility. */
  alt?: string;
  /** Optional label overlay (e.g. location name, camera ID). */
  label?: string;
  /** Optional timestamp overlay (e.g. "2 min ago", "14:23 UTC"). */
  timestamp?: string;
}

const styles = css`
  :host {
    display: block;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(var(--media-grid-min-width, 10rem), 1fr)
    );
    gap: var(--space-3);
  }

  .cell {
    position: relative;
    border-radius: var(--radius-md);
    overflow: hidden;
    background: var(--sunken-2);
    aspect-ratio: 16 / 10;
  }

  .cell img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform var(--duration-normal) ease;
  }

  .cell:hover img {
    transform: scale(1.03);
  }

  .overlay {
    position: absolute;
    inset: auto 0 0 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: var(--space-1_5);
    padding: var(--space-2) var(--space-2_5);
    background: linear-gradient(to top, oklch(0 0 0 / 0.55), transparent);
    pointer-events: none;
  }

  .overlay-label {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-none);
    color: white;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .overlay-timestamp {
    font-family: var(--font-sans);
    font-size: var(--text-2xs);
    color: oklch(1 0 0 / 0.7);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .empty {
    padding: var(--space-6) var(--space-4);
    text-align: center;
    color: var(--text-3);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
  }

  .actions[hidden] {
    display: none;
  }
`;

/**
 * `<dui-media-grid>` — A responsive grid of image/video thumbnails with label overlays.
 *
 * Ideal for camera feeds, location galleries, media libraries, or any visual monitoring
 * grid. Each cell shows a thumbnail image with an optional label and timestamp overlay.
 *
 * @slot actions - Optional action buttons below the grid.
 * @csspart grid - The CSS grid container.
 */
export class DuiMediaGrid extends LitElement {
  static tagName = "dui-media-grid" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge];

  /** Array of media items to display. */
  @property({ type: Array }) accessor data: MediaItem[] = [];

  /** Text shown when data is empty. */
  @property({ attribute: "empty-text" }) accessor emptyText = "No media";

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
      <div class="grid" part="grid">
        ${this.data.map(
          (item) => html`
            <div class="cell">
              <img
                src=${item.src}
                alt=${item.alt ?? item.label ?? ""}
                loading="lazy"
              />
              ${item.label || item.timestamp
                ? html`
                    <div class="overlay">
                      ${item.label
                        ? html`<span class="overlay-label">${item.label}</span>`
                        : nothing}
                      ${item.timestamp
                        ? html`<time class="overlay-timestamp">${item.timestamp}</time>`
                        : nothing}
                    </div>
                  `
                : nothing}
            </div>
          `,
        )}
      </div>
      <div class="actions" hidden>
        <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
      </div>
    `;
  }
}
