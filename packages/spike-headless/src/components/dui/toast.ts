/**
 * `<dui-toast-region-h>` — the whole toast surface in one file the app owns.
 *
 * Where the library needs four elements (`<dui-toast-region>`, `<dui-toast>`,
 * `<dui-toast-action>`, `<dui-toast-close>`), two contexts and an imperative
 * DOM-building layer, this is one element rendering a list.
 *
 * The app calls `toast("Saved")` exactly as before. What arrives is a record,
 * not an element, and the markup below is what renders it.
 *
 * Styles are adapted from `@dui/components/toast`, trimmed to what this markup
 * needs. Stacking uses the same custom properties the library publishes
 * (`--toast-index`, `--toasts-before-height`), so the visual behaviour matches.
 */
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { base } from "@dui/core/base";
import { spread } from "../../spread.ts";
import {
  type ToastPosition,
  ToastRegionController,
} from "../../toast-region-controller.ts";
import type { ToastRecord } from "../../toast-store.ts";
import "./_install.ts";
import "@dui/components/icon";

const styles = css`
  :host {
    position: fixed;
    z-index: 9999;
    display: block;
    width: var(--toast-width, 22rem);
    max-width: calc(100vw - var(--space-8));
    pointer-events: none;
  }

  :host([data-position^="top"]) {
    top: var(--space-4);
  }
  :host([data-position^="bottom"]) {
    bottom: var(--space-4);
  }
  :host([data-position$="right"]) {
    right: var(--space-4);
  }
  :host([data-position$="left"]) {
    left: var(--space-4);
  }
  :host([data-position$="center"]) {
    left: 50%;
    transform: translateX(-50%);
  }

  .list {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    height: var(--toast-collapsed-height, var(--space-16));
  }

  .toast {
    position: absolute;
    inset-inline: 0;
    display: flex;
    align-items: flex-start;
    gap: var(--space-2_5);
    box-sizing: border-box;
    padding: var(--space-3) var(--space-3_5);
    background: var(--surface-2);
    color: var(--text-1);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    pointer-events: auto;
    transition-property: transform, opacity, scale;
    transition-duration: var(--duration-normal);
    transition-timing-function: var(--ease-in-out-3);
  }

  /* Collapsed stack: each toast sits behind the one in front, scaled down. */
  :host([data-position^="bottom"]) .toast {
    bottom: 0;
    transform: translateY(calc(var(--toast-index) * -0.9rem));
    scale: calc(1 - (var(--toast-index) * 0.05));
  }
  :host([data-position^="top"]) .toast {
    top: 0;
    transform: translateY(calc(var(--toast-index) * 0.9rem));
    scale: calc(1 - (var(--toast-index) * 0.05));
  }

  /* Expanded: fan out by the real measured heights in front.
  * data-expanded is published by regionProps onto the list, not the host --
  * the host only carries the reflected position property. Getting this wrong
  * once is what the dev-mode spread check is for. */
  :host([data-position^="bottom"]) .list[data-expanded] .toast {
    transform: translateY(calc(var(--toasts-before-height) * -1 -
      var(--toast-index) * var(--space-2)));
    scale: 1;
  }
  :host([data-position^="top"]) .list[data-expanded] .toast {
    transform: translateY(calc(var(--toasts-before-height) + var(--toast-index) *
      var(--space-2)));
    scale: 1;
  }

  /* Expanding needs room; the collapsed height would clip the fan. */
  .list[data-expanded] {
    height: calc(var(--toasts-stack-height) + var(--space-4));
  }

  .toast[data-overflow] {
    opacity: 0;
    pointer-events: none;
  }

  .icon {
    flex-shrink: 0;
    --icon-size: var(--space-4);
    margin-block-start: var(--space-0_5);
    color: var(--toast-type-color, var(--text-2));
  }

  .toast[data-type="success"] {
    --toast-type-color: var(--success);
  }
  .toast[data-type="error"] {
    --toast-type-color: var(--destructive);
  }
  .toast[data-type="warning"] {
    --toast-type-color: var(--warning);
  }
  .toast[data-type="info"] {
    --toast-type-color: var(--info);
  }

  .body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-0_5);
  }
  .title {
    font-weight: var(--font-weight-medium);
  }
  .description {
    color: var(--text-2);
    font-size: var(--text-xs);
    line-height: var(--text-xs--line-height);
  }

  .action,
  .close {
    flex-shrink: 0;
    appearance: none;
    font: inherit;
    cursor: pointer;
    border-radius: var(--radius-sm);
  }

  .action {
    border: var(--border-width-thin) solid var(--border);
    background: var(--surface-1);
    color: var(--text-1);
    padding: var(--space-1) var(--space-2);
    font-size: var(--text-xs);
  }

  .action:hover {
    background: oklch(from var(--foreground) l c h / 0.05);
  }

  .close {
    border: 0;
    background: none;
    color: var(--text-3);
    --icon-size: var(--space-3_5);
    padding: var(--space-0_5);
    line-height: 0;
  }

  .close:hover {
    color: var(--text-1);
  }

  .action:focus-visible,
  .close:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }
`;

const ICONS: Record<string, string> = {
  success: "M20 6 9 17l-5-5",
  error: "M18 6 6 18M6 6l12 12",
  warning:
    "M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
  info: "M12 16v-4M12 8h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
};

export class DuiToastRegionH extends LitElement {
  static tagName = "dui-toast-region-h" as const;
  static override styles = [base, styles];

  @property({ type: String, reflect: true, attribute: "data-position" })
  accessor position: ToastPosition = "bottom-right";

  @property({ type: Number, attribute: "max-visible" })
  accessor maxVisible = 3;

  @property({ type: Boolean, attribute: "expand-on-hover" })
  accessor expandOnHover = true;

  @property({ type: String })
  accessor label = "Notifications";

  #region = new ToastRegionController(this, {
    getPosition: () => this.position,
    getMaxVisible: () => this.maxVisible,
    getExpandOnHover: () => this.expandOnHover,
    getLabel: () => this.label,
  });

  override render(): TemplateResult {
    const c = this.#region;

    return html`
      <ol class="list" ${spread(c.regionProps)}>
        ${repeat(
          c.toasts,
          (record) => record.id,
          (record, index) => this.#renderToast(record, index),
        )}
      </ol>
    `;
  }

  #renderToast(record: ToastRecord, index: number): TemplateResult {
    const c = this.#region;
    const path = ICONS[record.type];

    return html`
      <li class="toast" ${spread(c.toastProps(record, index))}>
        ${path
          ? html`
            <span class="icon">
              <dui-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="${path}" />
                </svg>
              </dui-icon>
            </span>
          `
          : nothing}
        <div class="body">
          <span class="title">${record.title}</span>
          ${record.description
            ? html`<span class="description">${record.description}</span>`
            : nothing}
        </div>
        ${record.action
          ? html`<button class="action" ${
            spread(c.actionProps(record))
          }>${record.action.label}</button>`
          : nothing}
        ${record.closeButton
          ? html`
            <button class="close" ${spread(c.closeProps(record.id))}>
              <dui-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </dui-icon>
            </button>
          `
          : nothing}
      </li>
    `;
  }
}

customElements.define(DuiToastRegionH.tagName, DuiToastRegionH);
