import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiIcon } from "@dui/components/icon";

const styles = css`
  :host {
    display: block;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--space-3);
    padding: var(--space-10) var(--space-6);
  }

  .icon-wrapper {
    --icon-size: 2.5rem;
    --icon-color: var(--text-3);
    opacity: 0.5;
  }

  .text {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .heading {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--text-1);
    margin: 0;
  }

  .description {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-3);
    margin: 0;
    max-width: 28rem;
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
 * `<dui-empty-state>` — A centered placeholder for no-data panels.
 *
 * Use inside section panels, tables, or lists when there's nothing to display.
 * Shows an optional icon, heading, description, and action slot for a primary CTA.
 *
 * @slot icon - Custom icon content (overrides the default empty-box icon).
 * @slot actions - Primary call-to-action button(s).
 * @csspart container - The outer centered container.
 * @csspart heading - The heading text.
 * @csspart description - The description text.
 */
export class DuiEmptyState extends LitElement {
  static tagName = "dui-empty-state" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiIcon];

  /** Primary heading text (e.g. "No events yet"). */
  @property() accessor heading = "";

  /** Supporting description text. */
  @property() accessor description = "";

  /** Toggle hidden on slot wrapper when slotted content changes. */
  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  /** Track whether an icon has been slotted. */
  #hasIconSlot = false;

  #onIconSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    this.#hasIconSlot = slot.assignedElements().length > 0;
    this.requestUpdate();
  }

  override render(): TemplateResult {
    // Default icon: an inbox/package box
    const defaultIcon = html`
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 7.5c0-1-2.5-3-5-3s-5 2-5 3"/>
        <path d="M20 7.5v9l-5 3.5-5-3.5v-9"/>
        <path d="M10 7.5 15 11l5-3.5"/>
        <path d="M15 11v7"/>
        <rect x="2" y="2" width="6" height="6" rx="1"/>
        <path d="M2 10v10c0 .6.4 1 1 1h4c.6 0 1-.4 1-1V10"/>
      </svg>`;

    return html`
      <div class="container" part="container">
        <div class="icon-wrapper">
          <dui-icon>
            <slot name="icon" @slotchange=${this.#onIconSlotChange}>
              ${!this.#hasIconSlot ? defaultIcon : nothing}
            </slot>
          </dui-icon>
        </div>

        <div class="text">
          ${this.heading
            ? html`<p class="heading" part="heading">${this.heading}</p>`
            : nothing}
          ${this.description
            ? html`<p class="description" part="description">${this.description}</p>`
            : nothing}
        </div>

        <div class="actions" hidden>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </div>
      </div>
    `;
  }
}
