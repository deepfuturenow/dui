/**
 * Inspector Overlay — hover highlight for DUI components.
 * Shows a semi-transparent border around the target element with a tag name label.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("dui-inspector-overlay")
export class InspectorOverlayElement extends LitElement {
  static override styles = css`
    :host {
      position: fixed;
      pointer-events: none;
      z-index: 99998;
      display: none;
    }

    :host([visible]) {
      display: block;
    }

    .border {
      position: fixed;
      border: 2px solid oklch(0.65 0.2 250);
      border-radius: 4px;
      background: oklch(0.65 0.2 250 / 0.08);
    }

    .label {
      position: absolute;
      top: -22px;
      left: -2px;
      background: oklch(0.65 0.2 250);
      color: white;
      font-family: ui-monospace, monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 3px 3px 0 0;
      white-space: nowrap;
      line-height: 16px;
    }
  `;

  @property({ type: Boolean, reflect: true })
  accessor visible = false;

  @state() accessor #rect: DOMRect | null = null;
  @state() accessor #tagName = "";

  /** Update the overlay to highlight the given element. */
  highlight(el: HTMLElement): void {
    this.#rect = el.getBoundingClientRect();
    this.#tagName = el.tagName.toLowerCase();
    this.visible = true;
  }

  /** Hide the overlay. */
  hide(): void {
    this.visible = false;
    this.#rect = null;
  }

  override render(): TemplateResult {
    if (!this.#rect) return html`${nothing}`;

    const { top, left, width, height } = this.#rect;

    return html`
      <div
        class="border"
        style="top:${top}px;left:${left}px;width:${width}px;height:${height}px"
      >
        <span class="label">${this.#tagName}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "dui-inspector-overlay": InspectorOverlayElement;
  }
}
