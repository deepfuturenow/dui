import { css, LitElement, type PropertyValues, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import type MapLibreGL from "maplibre-gl";
import { type MapContext, mapContext } from "../map/map-context.ts";

/** Fired when the route line is clicked. */
export const routeClickEvent = customEvent<void>("dui-route-click", { bubbles: true, composed: true });

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-route>` — GeoJSON LineString route layer on the map.
 *
 * @fires dui-route-click - Fired when the route line is clicked.
 */
export class DuiMapRoute extends LitElement {
  static tagName = "dui-map-route" as const;
  static override styles = [base, styles];

  /** Unique identifier for the route. Auto-generated if not set. */
  @property({ attribute: "route-id" })
  accessor routeId: string = `route-${Math.random().toString(36).slice(2, 9)}`;

  /** Array of `[longitude, latitude]` coordinate pairs defining the route. */
  @property({ type: Array })
  accessor coordinates: [number, number][] = [];

  /** Line color as CSS color value. */
  @property()
  accessor color = "#4285F4";

  /** Line width in pixels. */
  @property({ type: Number })
  accessor width = 3;

  /** Line opacity from 0 to 1. */
  @property({ type: Number })
  accessor opacity = 0.8;

  /** Dash pattern `[dash, gap]` for dashed lines. */
  @property({ type: Array, attribute: "dash-array" })
  accessor dashArray: [number, number] | undefined = undefined;

  /** Whether the route is interactive (pointer cursor on hover). */
  @property({ type: Boolean })
  accessor interactive = true;

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  #sourceId = "";
  #layerId = "";
  #layerAdded = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#sourceId = `route-source-${this.routeId}`;
    this.#layerId = `route-layer-${this.routeId}`;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#removeLayers();
  }

  override updated(changed: PropertyValues): void {
    const map = this._mapCtx?.map;
    const isLoaded = this._mapCtx?.isLoaded;
    if (!map || !isLoaded) return;

    // Add source and layer on first load
    if (!this.#layerAdded) {
      this.#addLayers(map);
    }

    // Update coordinates
    if (changed.has("coordinates") && this.coordinates.length >= 2) {
      const source = map.getSource(this.#sourceId) as MapLibreGL.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: this.coordinates },
        });
      }
    }

    // Update paint properties
    if (changed.has("color") || changed.has("width") || changed.has("opacity") || changed.has("dashArray")) {
      if (map.getLayer(this.#layerId)) {
        map.setPaintProperty(this.#layerId, "line-color", this.color);
        map.setPaintProperty(this.#layerId, "line-width", this.width);
        map.setPaintProperty(this.#layerId, "line-opacity", this.opacity);
        if (this.dashArray) {
          map.setPaintProperty(this.#layerId, "line-dasharray", this.dashArray);
        }
      }
    }
  }

  #addLayers(map: MapLibreGL.Map): void {
    if (map.getSource(this.#sourceId)) return;

    map.addSource(this.#sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: { type: "LineString", coordinates: [] },
      },
    });

    map.addLayer({
      id: this.#layerId,
      type: "line",
      source: this.#sourceId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": this.color,
        "line-width": this.width,
        "line-opacity": this.opacity,
        ...(this.dashArray ? { "line-dasharray": this.dashArray } : {}),
      },
    });

    if (this.interactive) {
      map.on("click", this.#layerId, () => {
        this.dispatchEvent(routeClickEvent());
      });
      map.on("mouseenter", this.#layerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", this.#layerId, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    this.#layerAdded = true;

    // Set initial coordinates if available
    if (this.coordinates.length >= 2) {
      const source = map.getSource(this.#sourceId) as MapLibreGL.GeoJSONSource;
      if (source) {
        source.setData({
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates: this.coordinates },
        });
      }
    }
  }

  #removeLayers(): void {
    const map = this._mapCtx?.map;
    if (!map) return;
    try {
      if (map.getLayer(this.#layerId)) map.removeLayer(this.#layerId);
      if (map.getSource(this.#sourceId)) map.removeSource(this.#sourceId);
    } catch {
      // Map may already be destroyed
    }
    this.#layerAdded = false;
  }

  override render(): TemplateResult {
    return html``;
  }
}

customElements.define(DuiMapRoute.tagName, DuiMapRoute);
