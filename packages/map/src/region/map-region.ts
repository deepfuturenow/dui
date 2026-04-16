import { css, LitElement, type PropertyValues, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import type MapLibreGL from "maplibre-gl";
import { type MapContext, mapContext } from "../map/map-context.ts";

/** Fired when the region is clicked. */
export const regionClickEvent = customEvent<void>("dui-region-click", { bubbles: true, composed: true });

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-region>` — GeoJSON polygon fill layer on the map.
 *
 * Renders filled polygon or multi-polygon regions with an optional border stroke.
 * Accepts inline GeoJSON data or a URL to fetch from.
 *
 * @fires dui-region-click - Fired when the region is clicked.
 */
export class DuiMapRegion extends LitElement {
  static tagName = "dui-map-region" as const;
  static override styles = [base, styles];

  /** Unique identifier. Auto-generated if not set. */
  @property({ attribute: "region-id" })
  accessor regionId: string = `region-${Math.random().toString(36).slice(2, 9)}`;

  /**
   * GeoJSON data — a URL string, a `Feature`, or a `FeatureCollection`
   * containing Polygon or MultiPolygon geometries.
   */
  @property({
    converter: {
      fromAttribute(value: string | null) {
        if (!value) return "";
        try { return JSON.parse(value); } catch { return value; }
      },
      toAttribute(value: unknown) {
        return typeof value === "string" ? value : JSON.stringify(value);
      },
    },
  })
  accessor data: string | GeoJSON.Feature | GeoJSON.FeatureCollection = "";

  /** Fill color. */
  @property({ attribute: "fill-color" })
  accessor fillColor = "rgba(59, 130, 246, 0.3)";

  /** Fill opacity (0–1). */
  @property({ type: Number, attribute: "fill-opacity" })
  accessor fillOpacity = 1;

  /** Border stroke color. */
  @property({ attribute: "stroke-color" })
  accessor strokeColor = "#3b82f6";

  /** Border stroke width in pixels. Set to 0 to hide the border. */
  @property({ type: Number, attribute: "stroke-width" })
  accessor strokeWidth = 2;

  /** Border stroke opacity (0–1). */
  @property({ type: Number, attribute: "stroke-opacity" })
  accessor strokeOpacity = 1;

  /** Whether the region is interactive (pointer cursor + click events). */
  @property({ type: Boolean })
  accessor interactive = true;

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  #sourceId = "";
  #fillLayerId = "";
  #strokeLayerId = "";
  #layersAdded = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#sourceId = `region-source-${this.regionId}`;
    this.#fillLayerId = `region-fill-${this.regionId}`;
    this.#strokeLayerId = `region-stroke-${this.regionId}`;
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#removeLayers();
  }

  override updated(changed: PropertyValues): void {
    const map = this._mapCtx?.map;
    const isLoaded = this._mapCtx?.isLoaded;
    if (!map || !isLoaded) return;

    if (!this.#layersAdded) {
      this.#addLayers(map);
    }

    // Update data (inline GeoJSON or URL string)
    if (changed.has("data") && this.data) {
      const source = map.getSource(this.#sourceId) as MapLibreGL.GeoJSONSource;
      if (source) {
        source.setData(this.data as string | GeoJSON.Feature | GeoJSON.FeatureCollection);
      }
    }

    // Update paint properties
    if (changed.has("fillColor") || changed.has("fillOpacity")) {
      if (map.getLayer(this.#fillLayerId)) {
        map.setPaintProperty(this.#fillLayerId, "fill-color", this.fillColor);
        map.setPaintProperty(this.#fillLayerId, "fill-opacity", this.fillOpacity);
      }
    }

    if (changed.has("strokeColor") || changed.has("strokeWidth") || changed.has("strokeOpacity")) {
      if (map.getLayer(this.#strokeLayerId)) {
        map.setPaintProperty(this.#strokeLayerId, "line-color", this.strokeColor);
        map.setPaintProperty(this.#strokeLayerId, "line-width", this.strokeWidth);
        map.setPaintProperty(this.#strokeLayerId, "line-opacity", this.strokeOpacity);
      }
    }
  }

  #addLayers(map: MapLibreGL.Map): void {
    if (map.getSource(this.#sourceId)) return;

    // Determine initial data — URL string vs inline GeoJSON
    const initialData: string | GeoJSON.Feature | GeoJSON.FeatureCollection =
      this.data || { type: "FeatureCollection" as const, features: [] };

    map.addSource(this.#sourceId, {
      type: "geojson",
      data: initialData as string | GeoJSON.FeatureCollection,
    });

    // Fill layer
    map.addLayer({
      id: this.#fillLayerId,
      type: "fill",
      source: this.#sourceId,
      paint: {
        "fill-color": this.fillColor,
        "fill-opacity": this.fillOpacity,
      },
    });

    // Stroke layer
    if (this.strokeWidth > 0) {
      map.addLayer({
        id: this.#strokeLayerId,
        type: "line",
        source: this.#sourceId,
        paint: {
          "line-color": this.strokeColor,
          "line-width": this.strokeWidth,
          "line-opacity": this.strokeOpacity,
        },
      });
    }

    if (this.interactive) {
      map.on("click", this.#fillLayerId, () => {
        this.dispatchEvent(regionClickEvent());
      });
      map.on("mouseenter", this.#fillLayerId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", this.#fillLayerId, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    this.#layersAdded = true;
  }

  #removeLayers(): void {
    const map = this._mapCtx?.map;
    if (!map) return;
    try {
      if (map.getLayer(this.#strokeLayerId)) map.removeLayer(this.#strokeLayerId);
      if (map.getLayer(this.#fillLayerId)) map.removeLayer(this.#fillLayerId);
      if (map.getSource(this.#sourceId)) map.removeSource(this.#sourceId);
    } catch {
      // Map may already be destroyed
    }
    this.#layersAdded = false;
  }

  override render(): TemplateResult {
    return html``;
  }
}
