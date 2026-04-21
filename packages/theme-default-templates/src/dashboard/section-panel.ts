import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";
import { DuiIcon } from "@dui/components/icon";
import { DuiCollapsible } from "@dui/components/collapsible";
import { DuiTooltip, DuiTooltipTrigger, DuiTooltipPopup } from "@dui/components/tooltip";

const styles = css`
  :host {
    display: block;
  }

  section {
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: var(--surface-1);
    overflow: hidden;
  }

  /* ── Header bar ── */
  .header {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    border-bottom: var(--border-width-thin) solid var(--border);
    min-height: var(--space-5);
    width: 100%;
    transition: border var(--duration-normal) linear;
  }


  :host([collapsible]:not([data-open])) .header {
    /* Hide header bottom border on collapsible sections when the section is closed */
    /* Or else we get double bottom borders. */
    border-color: transparent;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 0;
    flex: 1;
  }

  .icon-slot {
    display: contents;
  }

  .icon-slot[hidden] {
    display: none;
  }

  .icon-slot ::slotted(dui-icon) {
    --icon-size: 1rem;
    --icon-color: var(--text-2);
    flex-shrink: 0;
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
  }

  /* ── Indicators ── */
  .live {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    flex-shrink: 0;
  }

  .live-dot {
    display: inline-block;
    width: var(--space-1_5);
    height: var(--space-1_5);
    border-radius: var(--radius-full);
    background: var(--destructive);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }

  .live-label {
    font-family: var(--font-sans);
    font-size: var(--text-2xs);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-widest);
    text-transform: uppercase;
    color: var(--destructive-text);
  }

  .help-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--space-4);
    height: var(--space-4);
    border-radius: var(--radius-full);
    border: var(--border-width-thin) solid var(--border);
    background: transparent;
    color: var(--text-3);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--font-weight-medium);
    cursor: help;
    flex-shrink: 0;
    line-height: 1;
    transition: color var(--duration-fast) ease, border-color var(--duration-fast) ease;
  }

  .help-btn:hover {
    color: var(--text-2);
    border-color: var(--border-strong);
  }

  /* ── Header trailing ── */
  .header-right {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .actions-slot {
    display: contents;
  }

  .actions-slot[hidden] {
    display: none;
  }

  /* ── Body ── */
  .body {
    padding: var(--space-4);
  }

  /* ── Collapsible overrides ── */
  dui-collapsible {
    /* Hide the theme's indicator — we render our own chevron */
    --collapsible-indicator-display: none;
  }

  /* Reset the theme's trigger chrome so our .header controls layout */
  dui-collapsible::part(trigger) {
    padding: 0;
    height: auto;
    border-radius: 0;
  }

  dui-collapsible::part(content) {
    padding: 0;
  }

  /* ── Chevron ── */
  .chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--text-3);
    transition: transform var(--duration-fast) var(--ease-out-3);
  }

  :host([data-open]) .chevron {
    transform: rotate(180deg);
  }

  @media (prefers-reduced-motion: reduce) {
    .chevron {
      transition-duration: 0s;
    }
  }
`;

/**
 * `<dui-section-panel>` — A bordered container with a header bar, the fundamental
 * building block for dashboard panels.
 *
 * The header renders an optional icon (slotted), title, badge count, LIVE indicator,
 * help tooltip, and trailing actions. The body is slotted.
 *
 * When `collapsible` is set, the panel wraps its body in a `<dui-collapsible>`,
 * suppressing the collapsible's built-in indicator and rendering its own chevron.
 *
 * @slot - Body content.
 * @slot icon - Optional leading icon (`<dui-icon>` recommended).
 * @slot actions - Trailing actions in the header bar (buttons, menus, etc.).
 * @csspart section - The outer `<section>` container.
 * @csspart header - The header bar.
 * @csspart body - The body content wrapper.
 */
export class DuiSectionPanel extends LitElement {
  static tagName = "dui-section-panel" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [
    DuiBadge,
    DuiIcon,
    DuiCollapsible,
    DuiTooltip,
    DuiTooltipTrigger,
    DuiTooltipPopup,
  ];

  /** Panel title displayed in the header. */
  @property() override accessor title = "";

  /** Badge count shown after the title (e.g. "27"). */
  @property() accessor badge = "";

  /** Show a pulsing LIVE indicator in the header. */
  @property({ type: Boolean }) accessor live = false;

  /** Tooltip text for a help "?" indicator. */
  @property() accessor help = "";

  /** Enable collapsible mode — body can be toggled open/closed. */
  @property({ type: Boolean }) accessor collapsible = false;

  /** Whether the collapsible panel starts open (only relevant when collapsible). */
  @property({ type: Boolean, attribute: "default-open" }) accessor defaultOpen = true;

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  #onOpenChange(e: CustomEvent<{ open: boolean }>): void {
    this.toggleAttribute("data-open", e.detail.open);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.collapsible && this.defaultOpen) {
      this.toggleAttribute("data-open", true);
    }
  }

  #renderHeaderContent(): TemplateResult {
    return html`
      <div class="header-left">
        <span class="icon-slot" hidden><slot name="icon" @slotchange=${this.#onSlotChange}></slot></span>
        <span class="title">${this.title}</span>
        ${this.badge
          ? html`<dui-badge appearance="soft">${this.badge}</dui-badge>`
          : nothing}
        ${this.live
          ? html`<span class="live">
              <span class="live-dot"></span>
              <span class="live-label">Live</span>
            </span>`
          : nothing}
        ${this.help
          ? html`
            <dui-tooltip>
              <dui-tooltip-trigger>
                <button class="help-btn" aria-label="Help" @click=${this.#stopProp}>?</button>
              </dui-tooltip-trigger>
              <dui-tooltip-popup>${this.help}</dui-tooltip-popup>
            </dui-tooltip>`
          : nothing}
      </div>
      <div class="header-right">
        <span class="actions-slot" hidden @click=${this.collapsible ? this.#stopProp : nothing}>
          <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
        </span>
        ${this.collapsible
          ? html`<span class="chevron">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </span>`
          : nothing}
      </div>
    `;
  }

  override render(): TemplateResult {
    if (this.collapsible) {
      return html`
        <section part="section">
          <dui-collapsible
            .defaultOpen=${this.defaultOpen}
            @open-change=${this.#onOpenChange}
          >
            <div slot="trigger" class="header" part="header">
              ${this.#renderHeaderContent()}
            </div>

            <div class="body" part="body">
              <slot></slot>
            </div>
          </dui-collapsible>
        </section>
      `;
    }

    return html`
      <section part="section">
        <div class="header" part="header">
          ${this.#renderHeaderContent()}
        </div>
        <div class="body" part="body">
          <slot></slot>
        </div>
      </section>
    `;
  }

  /** Stop click propagation so actions/help in header don't trigger collapse. */
  #stopProp(e: Event): void {
    e.stopPropagation();
  }
}
