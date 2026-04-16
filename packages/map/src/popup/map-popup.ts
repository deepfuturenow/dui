import { css, LitElement, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import MapLibreGL from "maplibre-gl";
import { type MapContext, mapContext } from "../map/map-context.ts";

/** Fired when the popup is closed. */
export const popupCloseEvent = customEvent<void>("dui-map-popup-close", { bubbles: true, composed: true });

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-popup>` — Standalone popup at coordinates on the map.
 *
 * @slot - Popup content.
 * @csspart popup - The popup content wrapper.
 * @fires dui-map-popup-close - Fired when the popup is closed.
 */
export class DuiMapPopup extends LitElement {
  static tagName = "dui-map-popup" as const;
  static override styles = [base, styles];

  /** Longitude coordinate for popup position. */
  @property({ type: Number })
  accessor longitude = 0;

  /** Latitude coordinate for popup position. */
  @property({ type: Number })
  accessor latitude = 0;

  /** Popup offset from the anchor in pixels. */
  @property({ type: Number, attribute: "popup-offset" })
  accessor popupOffset = 16;

  /** Show a close button. */
  @property({ type: Boolean, attribute: "close-button" })
  accessor closeButton = false;

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  #popup: MapLibreGL.Popup | null = null;
  #container: HTMLDivElement = document.createElement("div");
  #addedToMap = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#popup = new MapLibreGL.Popup({
      offset: this.popupOffset,
      closeButton: false,
      className: "dui-popup",
    })
      .setMaxWidth("none")
      .setLngLat([this.longitude, this.latitude]);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#popup?.remove();
    this.#popup = null;
    this.#addedToMap = false;
  }

  override updated(): void {
    const map = this._mapCtx?.map;
    if (!map || !this.#popup) return;

    if (!this.#addedToMap) {
      this.#popup.on("close", () => {
        this.dispatchEvent(popupCloseEvent());
      });
      this.#popup.setDOMContent(this.#container);
      this.#popup.addTo(map);
      this.#addedToMap = true;
    }

    // Update position
    if (this.#popup.isOpen()) {
      const ll = this.#popup.getLngLat();
      if (ll.lng !== this.longitude || ll.lat !== this.latitude) {
        this.#popup.setLngLat([this.longitude, this.latitude]);
      }
      // Update offset
      if (this.#popup.options?.offset !== this.popupOffset) {
        this.#popup.setOffset(this.popupOffset);
      }
    }

    this.#renderIntoPortal();
  }

  #handleClose = (): void => {
    this.#popup?.remove();
  };

  #renderIntoPortal(): void {
    const slot = this.shadowRoot!.querySelector("slot");
    if (!slot) return;
    const assigned = slot.assignedNodes({ flatten: true });

    this.#container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.setAttribute("part", "popup");

    if (this.closeButton) {
      const btn = document.createElement("button");
      btn.setAttribute("aria-label", "Close popup");
      btn.type = "button";
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
      btn.style.cssText = "position:absolute;top:4px;right:4px;z-index:10;background:none;border:none;cursor:pointer;padding:2px;opacity:0.7;color:inherit;";
      btn.addEventListener("click", this.#handleClose);
      wrapper.appendChild(btn);
    }

    for (const node of assigned) {
      wrapper.appendChild(node.cloneNode(true));
    }

    this.#container.appendChild(wrapper);
  }

  override render(): TemplateResult {
    return html`<slot style="display:none" @slotchange=${this.#renderIntoPortal}></slot>`;
  }
}
