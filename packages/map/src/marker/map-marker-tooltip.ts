import { css, LitElement, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import MapLibreGL from "maplibre-gl";
import { type MarkerContext, markerContext } from "./marker-context.ts";

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-marker-tooltip>` — Hover tooltip on a marker.
 *
 * Shows a popup when the user hovers over the parent marker.
 *
 * @slot - Tooltip content.
 * @csspart tooltip - The tooltip content wrapper.
 */
export class DuiMapMarkerTooltip extends LitElement {
  static tagName = "dui-map-marker-tooltip" as const;
  static override styles = [base, styles];

  /** Tooltip offset from the marker in pixels. */
  @property({ type: Number, attribute: "tooltip-offset" })
  accessor tooltipOffset = 16;

  @consume({ context: markerContext, subscribe: true })
  accessor _markerCtx!: MarkerContext;

  #tooltip: MapLibreGL.Popup | null = null;
  #container: HTMLDivElement = document.createElement("div");
  #mouseEnterHandler: (() => void) | null = null;
  #mouseLeaveHandler: (() => void) | null = null;
  #bound = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#tooltip = new MapLibreGL.Popup({
      offset: this.tooltipOffset,
      closeOnClick: true,
      closeButton: false,
      className: "dui-tooltip",
    }).setMaxWidth("none");
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#unbindEvents();
    this.#tooltip?.remove();
    this.#tooltip = null;
  }

  override updated(): void {
    if (!this._markerCtx?.marker || !this._markerCtx?.map || !this.#tooltip) return;

    this.#tooltip.setDOMContent(this.#container);

    if (!this.#bound) {
      this.#bindEvents();
    }

    // Update offset if changed
    if (this.#tooltip.options?.offset !== this.tooltipOffset) {
      this.#tooltip.setOffset(this.tooltipOffset);
    }

    this.#renderIntoPortal();
  }

  #bindEvents(): void {
    const el = this._markerCtx?.marker?.getElement();
    const map = this._markerCtx?.map;
    if (!el || !map) return;

    this.#mouseEnterHandler = () => {
      this.#tooltip!.setLngLat(this._markerCtx.marker.getLngLat()).addTo(map);
    };
    this.#mouseLeaveHandler = () => {
      this.#tooltip!.remove();
    };

    el.addEventListener("mouseenter", this.#mouseEnterHandler);
    el.addEventListener("mouseleave", this.#mouseLeaveHandler);
    this.#bound = true;
  }

  #unbindEvents(): void {
    const el = this._markerCtx?.marker?.getElement();
    if (!el) return;
    if (this.#mouseEnterHandler) el.removeEventListener("mouseenter", this.#mouseEnterHandler);
    if (this.#mouseLeaveHandler) el.removeEventListener("mouseleave", this.#mouseLeaveHandler);
    this.#mouseEnterHandler = null;
    this.#mouseLeaveHandler = null;
    this.#bound = false;
  }

  #renderIntoPortal(): void {
    const slot = this.shadowRoot!.querySelector("slot");
    if (!slot) return;
    const assigned = slot.assignedNodes({ flatten: true });

    this.#container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.setAttribute("part", "tooltip");

    for (const node of assigned) {
      wrapper.appendChild(node.cloneNode(true));
    }

    this.#container.appendChild(wrapper);
  }

  override render(): TemplateResult {
    return html`<slot style="display:none" @slotchange=${this.#renderIntoPortal}></slot>`;
  }
}
