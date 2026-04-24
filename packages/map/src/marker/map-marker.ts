import { css, LitElement, type PropertyValues, type TemplateResult, html } from "lit";
import { property, state } from "lit/decorators.js";
import { provide, consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import MapLibreGL from "maplibre-gl";
import { type MapContext, mapContext } from "../map/map-context.ts";
import { type MarkerContext, markerContext } from "./marker-context.ts";

export type LngLat = { lng: number; lat: number };

/** Fired when marker drag starts. */
export const dragStartEvent = customEvent<LngLat>("dui-marker-dragstart", { bubbles: true, composed: true });
/** Fired during marker drag. */
export const dragEvent = customEvent<LngLat>("dui-marker-drag", { bubbles: true, composed: true });
/** Fired when marker drag ends. */
export const dragEndEvent = customEvent<LngLat>("dui-marker-dragend", { bubbles: true, composed: true });

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-marker>` — Places a marker at a coordinate on the map.
 *
 * Contains sub-components: `<dui-map-marker-content>`, `<dui-map-marker-popup>`,
 * `<dui-map-marker-tooltip>`, `<dui-map-marker-label>`.
 *
 * @slot - Marker sub-components.
 * @fires dui-marker-dragstart - Drag started. Detail: { lng, lat }
 * @fires dui-marker-drag - Dragging. Detail: { lng, lat }
 * @fires dui-marker-dragend - Drag ended. Detail: { lng, lat }
 */
export class DuiMapMarker extends LitElement {
  static tagName = "dui-map-marker" as const;
  static override styles = [base, styles];

  /** Longitude coordinate. */
  @property({ type: Number })
  accessor longitude = 0;

  /** Latitude coordinate. */
  @property({ type: Number })
  accessor latitude = 0;

  /** Whether the marker can be dragged. */
  @property({ type: Boolean })
  accessor draggable = false;

  /** Marker rotation in degrees. */
  @property({ type: Number })
  accessor rotation = 0;

  /** Offset from the marker center as `[x, y]`. */
  @property({ type: Array })
  accessor offset: [number, number] = [0, 0];

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  #marker: MapLibreGL.Marker | null = null;
  #addedToMap = false;

  @provide({ context: markerContext })
  @state()
  accessor _markerCtx: MarkerContext = { marker: null!, map: null };

  override connectedCallback(): void {
    super.connectedCallback();
    this.#createMarker();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#destroyMarker();
  }

  override updated(changed: PropertyValues): void {
    const map = this._mapCtx?.map;

    // Add to map once available
    if (this.#marker && map && !this.#addedToMap) {
      this.#marker.addTo(map);
      this.#addedToMap = true;
    }

    // Update position
    if (this.#marker) {
      const current = this.#marker.getLngLat();
      if (current.lng !== this.longitude || current.lat !== this.latitude) {
        this.#marker.setLngLat([this.longitude, this.latitude]);
      }
    }

    // Update draggable
    if (this.#marker && this.#marker.isDraggable() !== this.draggable) {
      this.#marker.setDraggable(this.draggable);
    }

    // Update offset
    if (this.#marker) {
      const cur = this.#marker.getOffset();
      if (cur.x !== this.offset[0] || cur.y !== this.offset[1]) {
        this.#marker.setOffset(this.offset);
      }
    }

    // Update rotation
    if (this.#marker && this.#marker.getRotation() !== this.rotation) {
      this.#marker.setRotation(this.rotation);
    }

    // Update context only when values actually change
    if (this.#marker && (this._markerCtx.marker !== this.#marker || this._markerCtx.map !== map)) {
      this._markerCtx = { marker: this.#marker, map };
    }
  }

  /** Get the underlying MapLibre Marker instance. */
  getMarkerInstance(): MapLibreGL.Marker | null {
    return this.#marker;
  }

  #createMarker(): void {
    this.#marker = new MapLibreGL.Marker({
      element: document.createElement("div"),
      draggable: this.draggable,
    }).setLngLat([this.longitude, this.latitude]);

    // Drag events
    this.#marker.on("dragstart", () => {
      const ll = this.#marker!.getLngLat();
      this.dispatchEvent(dragStartEvent({ lng: ll.lng, lat: ll.lat }));
    });
    this.#marker.on("drag", () => {
      const ll = this.#marker!.getLngLat();
      this.dispatchEvent(dragEvent({ lng: ll.lng, lat: ll.lat }));
    });
    this.#marker.on("dragend", () => {
      const ll = this.#marker!.getLngLat();
      this.dispatchEvent(dragEndEvent({ lng: ll.lng, lat: ll.lat }));
    });

    this._markerCtx = { marker: this.#marker, map: this._mapCtx?.map ?? null };
  }

  #destroyMarker(): void {
    if (this.#marker) {
      this.#marker.remove();
      this.#marker = null;
      this.#addedToMap = false;
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}

customElements.define(DuiMapMarker.tagName, DuiMapMarker);
