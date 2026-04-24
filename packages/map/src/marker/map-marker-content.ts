import { css, LitElement, type TemplateResult, html } from "lit";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { type MarkerContext, markerContext } from "./marker-context.ts";

const styles = css`
  :host {
    display: contents;
  }

  [part="root"] {
    position: relative;
    cursor: pointer;
  }

  .default-marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }
`;

/**
 * `<dui-map-marker-content>` — Custom marker DOM content.
 *
 * Renders slotted content into the marker's DOM element. If no content
 * is provided, renders a default blue dot marker.
 *
 * @slot - Custom marker content.
 * @csspart root - Wrapper div inside the marker element.
 */
export class DuiMapMarkerContent extends LitElement {
  static tagName = "dui-map-marker-content" as const;
  static override styles = [base, styles];

  @consume({ context: markerContext, subscribe: true })
  accessor _markerCtx!: MarkerContext;

  #portalContainer: HTMLDivElement | null = null;
  #hasSlottedContent = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#portalContainer = document.createElement("div");
    this.#portalContainer.setAttribute("part", "root");
    this.#portalContainer.style.position = "relative";
    this.#portalContainer.style.cursor = "pointer";
  }

  override updated(): void {
    if (!this._markerCtx?.marker || !this.#portalContainer) return;

    const el = this._markerCtx.marker.getElement();
    if (el && !el.contains(this.#portalContainer)) {
      // Clear default MapLibre marker styling
      el.style.backgroundImage = "none";
      el.style.width = "";
      el.style.height = "";
      el.appendChild(this.#portalContainer);
    }

    this.#renderIntoPortal();
  }

  #renderIntoPortal(): void {
    if (!this.#portalContainer) return;

    // Move slotted light DOM children into the marker element
    const slot = this.shadowRoot!.querySelector("slot");
    if (!slot) return;
    const assigned = slot.assignedNodes({ flatten: true });
    this.#hasSlottedContent = assigned.length > 0;

    // Clear and re-append
    this.#portalContainer.innerHTML = "";
    if (this.#hasSlottedContent) {
      for (const node of assigned) {
        this.#portalContainer.appendChild(node.cloneNode(true));
      }
    } else {
      // Default marker — styled by the dui-map theme via .dui-default-marker
      const dot = document.createElement("div");
      dot.className = "dui-default-marker";
      this.#portalContainer.appendChild(dot);
    }
  }

  override render(): TemplateResult {
    // Hidden slot — content is portaled into the marker element
    return html`<slot style="display:none" @slotchange=${this.#renderIntoPortal}></slot>`;
  }
}

customElements.define(DuiMapMarkerContent.tagName, DuiMapMarkerContent);
