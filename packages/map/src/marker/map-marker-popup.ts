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
 * `<dui-map-marker-popup>` — Click-to-open popup on a marker.
 *
 * Slotted content is rendered inside a MapLibre popup attached to the parent marker.
 * The popup opens when the marker is clicked.
 *
 * @slot - Popup content.
 * @csspart popup - The popup content wrapper.
 */
export class DuiMapMarkerPopup extends LitElement {
  static tagName = "dui-map-marker-popup" as const;
  static override styles = [base, styles];

  /** Popup offset from the marker in pixels. */
  @property({ type: Number, attribute: "popup-offset" })
  accessor popupOffset = 16;

  /** Show a close button. */
  @property({ type: Boolean, attribute: "close-button" })
  accessor closeButton = false;

  @consume({ context: markerContext, subscribe: true })
  accessor _markerCtx!: MarkerContext;

  #popup: MapLibreGL.Popup | null = null;
  #container: HTMLDivElement = document.createElement("div");
  #attachedToMarker = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#popup = new MapLibreGL.Popup({
      offset: this.popupOffset,
      closeButton: false,
      closeOnClick: true,
      className: "dui-popup",
    })
      .setMaxWidth("none")
      .setDOMContent(this.#container);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._markerCtx?.marker) {
      this._markerCtx.marker.setPopup(null);
    }
    this.#popup?.remove();
    this.#popup = null;
    this.#attachedToMarker = false;
  }

  override updated(): void {
    if (!this._markerCtx?.marker || !this._markerCtx?.map || !this.#popup) return;

    if (!this.#attachedToMarker) {
      this.#popup.setDOMContent(this.#container);
      this._markerCtx.marker.setPopup(this.#popup);
      this.#attachedToMarker = true;
    }

    // Update offset if changed
    if (this.#popup.options?.offset !== this.popupOffset) {
      this.#popup.setOffset(this.popupOffset);
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
