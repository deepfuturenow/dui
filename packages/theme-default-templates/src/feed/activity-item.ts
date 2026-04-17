import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { type DuiComponentClass } from "@dui/core/apply-theme";
import { DuiBadge } from "@dui/components/badge";

/** Status → dot color mapping. */
const STATUS_COLORS: Record<string, string> = {
  success: "var(--accent)",
  error: "var(--destructive)",
  warning: "var(--accent-text)",
  info: "var(--text-3)",
  pending: "var(--text-3)",
};

const DOT_SIZE = "--space-2";
const TRACK_LEFT = "var(--space-0_5)"; /* center of the dot column */

const styles = css`
  :host {
    display: block;
    --_dot-color: var(--border-strong);
    --_dot-size: var(--space-2);
    /* Total left gutter = dot-size + gap */
    --_gutter: calc(var(--_dot-size) + var(--space-3));
  }

  article {
    position: relative;
    padding-left: var(--_gutter);
    padding-bottom: var(--space-4);
  }

  :host([last]) article {
    padding-bottom: 0;
  }

  /* ── Vertical line — runs full height of the article ── */
  article::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    /* Center the line under the dot */
    left: calc(var(--_dot-size) / 2 - 0.5px);
    width: var(--border-width-thin, 1px);
    background: var(--border);
    margin-top: 1rem;
  }

  /* :host([last]) article::before {
    display: none;
  } */

  /* ── Content ── */
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--space-0_5);
    min-width: 0;
  }

  /* ── Header — the dot is a ::before pseudo-element ── */
  .header {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    min-width: 0;
  }

  .title {
    position: relative;
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--foreground);
    white-space: nowrap;
    text-overflow: ellipsis;
    min-width: 0;
  }

  .title::before {
    content: "";
    position: absolute;
    width: var(--_dot-size);
    height: var(--_dot-size);
    border-radius: var(--radius-full);
    background: var(--_dot-color);
    /* Position: pull left into the gutter, vertically center with the title line */
    left: calc(-1 * var(--_gutter));
    /* Align to the first line of text: offset by half line-height minus half dot */
    top: calc(var(--font-size-sm) * 0.35);
  }


  .timestamp {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-snug);
    color: var(--text-3);
    flex-shrink: 0;
    white-space: nowrap;
  }

  .description {
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
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
 * `<dui-activity-item>` — A timestamped event in a vertical timeline.
 *
 * Renders a timeline dot + connecting line on the left, with a title,
 * timestamp, optional description, and optional status badge on the right.
 * The dot is a pseudo-element of the header row so it always aligns with
 * the title text. Stack multiple activity-items to form a timeline. Set
 * `last` on the final item to hide the trailing line.
 *
 * @slot actions - Optional action buttons or links.
 * @csspart article - The outer container.
 * @csspart title - The event title.
 * @csspart timestamp - The timestamp text.
 * @csspart description - The description paragraph.
 */
export class DuiActivityItem extends LitElement {
  static tagName = "dui-activity-item" as const;
  static override styles = [base, styles];
  static dependencies: DuiComponentClass[] = [DuiBadge];

  /** Event title. */
  @property() override accessor title = "";

  /** Display timestamp (e.g. "2 min ago", "14:23 UTC"). */
  @property() accessor timestamp = "";

  /** Optional description text. */
  @property() accessor description = "";

  /** Status — determines dot color (success | error | warning | info | pending). */
  @property() accessor status = "";

  /** Optional status label — renders as a badge next to the title. */
  @property({ attribute: "status-label" }) accessor statusLabel = "";

  /** Mark as the last item to hide the trailing timeline line. */
  @property({ type: Boolean, reflect: true }) accessor last = false;

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  override render(): TemplateResult {
    const dotColor = STATUS_COLORS[this.status.toLowerCase()] ?? undefined;
    const dotStyle = dotColor ? `--_dot-color: ${dotColor}` : "";

    // Map status to badge variant
    const badgeVariant =
      this.status === "error" ? "danger"
      : this.status === "success" ? "primary"
      : "neutral";

    return html`
      <article part="article" style=${dotStyle}>
        <div class="content">
          <div class="header">
            <span class="title" part="title">${this.title}</span>
            ${this.statusLabel
              ? html`<dui-badge appearance="ghost" size="sm" variant=${badgeVariant}>${this.statusLabel}</dui-badge>`
              : nothing}
            ${this.timestamp
              ? html`<time class="timestamp" part="timestamp">${this.timestamp}</time>`
              : nothing}
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
