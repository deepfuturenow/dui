import { css, LitElement, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { type MarkerContext, markerContext } from "./marker-context.ts";

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-marker-label>` — Static label above or below a marker.
 *
 * Renders slotted text content as a label positioned relative to the marker.
 *
 * @slot - Label text content.
 * @csspart label - The label element.
 */
export class DuiMapMarkerLabel extends LitElement {
  static tagName = "dui-map-marker-label" as const;
  static override styles = [base, styles];

  /** Position of the label relative to the marker. */
  @property()
  accessor position: "top" | "bottom" = "top";

  @consume({ context: markerContext, subscribe: true })
  accessor _markerCtx!: MarkerContext;

  #labelEl: HTMLDivElement | null = null;

  override updated(): void {
    if (!this._markerCtx?.marker) return;

    const markerEl = this._markerCtx.marker.getElement();
    if (!markerEl) return;

    if (!this.#labelEl) {
      this.#labelEl = document.createElement("div");
      this.#labelEl.setAttribute("part", "label");
      this.#labelEl.className = "dui-marker-label";
      markerEl.appendChild(this.#labelEl);
    }

    // Position — structural only (aesthetic styles in theme)
    this.#labelEl.style.cssText = `
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      white-space: nowrap;
      pointer-events: none;
      ${this.position === "top" ? "bottom: 100%; margin-bottom: 4px;" : "top: 100%; margin-top: 4px;"}
    `;

    this.#renderIntoPortal();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#labelEl?.remove();
    this.#labelEl = null;
  }

  #renderIntoPortal(): void {
    if (!this.#labelEl) return;
    const slot = this.shadowRoot!.querySelector("slot");
    if (!slot) return;
    const assigned = slot.assignedNodes({ flatten: true });

    this.#labelEl.innerHTML = "";
    for (const node of assigned) {
      this.#labelEl.appendChild(node.cloneNode(true));
    }
  }

  override render(): TemplateResult {
    return html`<slot style="display:none" @slotchange=${this.#renderIntoPortal}></slot>`;
  }
}
