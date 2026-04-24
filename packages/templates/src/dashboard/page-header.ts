import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { base } from "@dui/core/base";
import "@dui/components/separator";
import {
  DuiBreadcrumb,
  DuiBreadcrumbItem,
  DuiBreadcrumbLink,
  DuiBreadcrumbPage,
  DuiBreadcrumbSeparator,
} from "@dui/components/breadcrumb";

const styles = css`
  :host {
    display: block;
  }

  header {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-5) var(--space-6);
  }

  /* ── Title row ── */
  .title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .title-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  .title {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--letter-spacing-normal);
    line-height: var(--line-height-tight);
    color: var(--foreground);
    margin: 0;
  }

  .subtitle {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    letter-spacing: var(--letter-spacing-wide);
    line-height: var(--line-height-normal);
    color: var(--text-2);
    margin: 0;
  }

  /* ── Actions slot ── */
  .actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-shrink: 0;
  }

  .actions[hidden] {
    display: none;
  }

  /* ── Bottom border ── */
  dui-separator {
    margin-top: var(--space-1);
  }
`;

/**
 * `<dui-page-header>` — Full-width top bar for dashboard pages.
 *
 * Renders an optional breadcrumb trail, a title, an optional subtitle,
 * and trailing action buttons. A separator is rendered at the bottom.
 *
 * The `breadcrumbs` prop accepts a comma-separated string. The last segment
 * is rendered as the current page; preceding segments render as links.
 *
 * @slot actions - Trailing action buttons or controls.
 * @csspart header - The outer `<header>` container.
 * @csspart breadcrumb - The breadcrumb navigation.
 * @csspart title - The page title.
 * @csspart subtitle - The subtitle paragraph.
 */
export class DuiPageHeader extends LitElement {
  static tagName = "dui-page-header" as const;
  static override styles = [base, styles];
  /** Page title displayed prominently. */
  @property() override accessor title = "";

  /** Supporting text below the title. */
  @property() accessor subtitle = "";

  /** Comma-separated breadcrumb trail (e.g. "Home, Settings, Profile"). */
  @property() accessor breadcrumbs = "";

  #onSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    slot.parentElement!.hidden = slot.assignedElements().length === 0;
  }

  #renderBreadcrumbs(): TemplateResult | typeof nothing {
    if (!this.breadcrumbs) return nothing;

    const segments = this.breadcrumbs.split(",").map((s) => s.trim()).filter(
      Boolean,
    );
    if (segments.length === 0) return nothing;

    const items: TemplateResult[] = [];

    segments.forEach((segment, i) => {
      const isLast = i === segments.length - 1;

      if (i > 0) {
        items.push(
          html`<dui-breadcrumb-separator></dui-breadcrumb-separator>`,
        );
      }

      if (isLast) {
        items.push(html`
          <dui-breadcrumb-item>
            <dui-breadcrumb-page>${segment}</dui-breadcrumb-page>
          </dui-breadcrumb-item>
        `);
      } else {
        items.push(html`
          <dui-breadcrumb-item>
            <dui-breadcrumb-link>
              <a href="javascript:void(0)">${segment}</a>
            </dui-breadcrumb-link>
          </dui-breadcrumb-item>
        `);
      }
    });

    return html`
      <dui-breadcrumb part="breadcrumb">${items}</dui-breadcrumb>
    `;
  }

  override render(): TemplateResult {
    return html`
      <header part="header">
        ${this.#renderBreadcrumbs()}

        <div class="title-row">
          <div class="title-group">
            <h1 class="title" part="title">${this.title}</h1>
            ${this.subtitle
              ? html`<p class="subtitle" part="subtitle">${this.subtitle}</p>`
              : nothing}
          </div>

          <div class="actions" hidden>
            <slot name="actions" @slotchange=${this.#onSlotChange}></slot>
          </div>
        </div>
      </header>
      <dui-separator></dui-separator>
    `;
  }
}

customElements.define(DuiPageHeader.tagName, DuiPageHeader);
