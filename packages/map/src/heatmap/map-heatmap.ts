import { css, LitElement, type PropertyValues, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import type MapLibreGL from "maplibre-gl";
import { type MapContext, mapContext } from "../map/map-context.ts";

const DEFAULT_COLOR_RAMP = [
  "rgba(0,0,255,0)",
  "#00f",
  "#0ff",
  "#0f0",
  "#ff0",
  "#f00",
];

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-heatmap>` — Heatmap density visualization on the map.
 *
 * Accepts a GeoJSON FeatureCollection (or URL string) and renders a heatmap layer
 * with configurable radius, intensity, color ramp, and optional individual points
 * at high zoom levels.
 */
export class DuiMapHeatmap extends LitElement {
  static tagName = "dui-map-heatmap" as const;
  static override styles = [base, styles];

  /** GeoJSON data URL or inline FeatureCollection. */
  @property({ type: String })
  accessor data: string | GeoJSON.FeatureCollection<GeoJSON.Point> = "";

  /** Heatmap kernel radius in pixels. */
  @property({ type: Number })
  accessor radius = 20;

  /** Global intensity multiplier. */
  @property({ type: Number })
  accessor intensity = 1;

  /** Heatmap layer opacity (0–1). */
  @property({ type: Number })
  accessor opacity = 0.8;

  /** GeoJSON property name to use as point weight. Empty = equal weight. */
  @property()
  accessor weight = "";

  /** Maximum zoom at which the heatmap is visible. Above this, show individual points. */
  @property({ type: Number, attribute: "max-zoom" })
  accessor maxZoom = 9;

  /** Whether to show individual points when zoomed past maxZoom. */
  @property({ type: Boolean, attribute: "show-points" })
  accessor showPoints = true;

  /** Color for individual points (shown above maxZoom). */
  @property({ attribute: "point-color" })
  accessor pointColor = "#3b82f6";

  /** Array of CSS colors for the heatmap gradient from cool→hot. */
  @property({ type: Array, attribute: "color-ramp" })
  accessor colorRamp: string[] = DEFAULT_COLOR_RAMP;

  /** Unique ID for source/layer. Auto-generated if not set. */
  @property({ attribute: "heatmap-id" })
  accessor heatmapId: string = `heatmap-${Math.random().toString(36).slice(2, 9)}`;

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  #sourceId = "";
  #heatmapLayerId = "";
  #pointLayerId = "";
  #layersAdded = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#sourceId = `heatmap-source-${this.heatmapId}`;
    this.#heatmapLayerId = `heatmap-layer-${this.heatmapId}`;
    this.#pointLayerId = `heatmap-points-${this.heatmapId}`;
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

    // Update source data when data changes (for non-URL data)
    if (changed.has("data") && typeof this.data !== "string") {
      const source = map.getSource(this.#sourceId) as MapLibreGL.GeoJSONSource;
      if (source) {
        source.setData(this.data as GeoJSON.FeatureCollection<GeoJSON.Point>);
      }
    }

    // Update heatmap paint properties
    if (changed.has("radius") || changed.has("maxZoom")) {
      if (map.getLayer(this.#heatmapLayerId)) {
        map.setPaintProperty(this.#heatmapLayerId, "heatmap-radius", [
          "interpolate", ["linear"], ["zoom"],
          0, 2,
          this.maxZoom, this.radius,
        ]);
      }
    }

    if (changed.has("intensity") || changed.has("maxZoom")) {
      if (map.getLayer(this.#heatmapLayerId)) {
        map.setPaintProperty(this.#heatmapLayerId, "heatmap-intensity", [
          "interpolate", ["linear"], ["zoom"],
          0, 1,
          this.maxZoom, this.intensity,
        ]);
      }
    }

    if (changed.has("opacity") || changed.has("maxZoom")) {
      if (map.getLayer(this.#heatmapLayerId)) {
        map.setPaintProperty(this.#heatmapLayerId, "heatmap-opacity", [
          "interpolate", ["linear"], ["zoom"],
          7, this.opacity,
          this.maxZoom, 0,
        ]);
      }
    }

    if (changed.has("colorRamp")) {
      if (map.getLayer(this.#heatmapLayerId)) {
        map.setPaintProperty(this.#heatmapLayerId, "heatmap-color", this.#buildColorRamp());
      }
    }

    if (changed.has("pointColor")) {
      if (map.getLayer(this.#pointLayerId)) {
        map.setPaintProperty(this.#pointLayerId, "circle-color", this.pointColor);
      }
    }
  }

  #buildColorRamp(): unknown[] {
    const ramp = this.colorRamp;
    const expr: unknown[] = ["interpolate", ["linear"], ["heatmap-density"]];
    for (let i = 0; i < ramp.length; i++) {
      expr.push(i / (ramp.length - 1));
      expr.push(ramp[i]);
    }
    return expr;
  }

  #addLayers(map: MapLibreGL.Map): void {
    if (map.getSource(this.#sourceId)) return;

    map.addSource(this.#sourceId, {
      type: "geojson",
      data: this.data as string | GeoJSON.FeatureCollection,
    });

    // Heatmap weight expression
    const heatmapWeight: unknown = this.weight
      ? ["interpolate", ["linear"], ["get", this.weight], 0, 0, 6, 1]
      : 1;

    // Heatmap layer
    map.addLayer({
      id: this.#heatmapLayerId,
      type: "heatmap",
      source: this.#sourceId,
      maxzoom: this.maxZoom,
      paint: {
        "heatmap-weight": heatmapWeight,
        "heatmap-intensity": [
          "interpolate", ["linear"], ["zoom"],
          0, 1,
          this.maxZoom, this.intensity,
        ],
        "heatmap-color": this.#buildColorRamp(),
        "heatmap-radius": [
          "interpolate", ["linear"], ["zoom"],
          0, 2,
          this.maxZoom, this.radius,
        ],
        "heatmap-opacity": [
          "interpolate", ["linear"], ["zoom"],
          7, this.opacity,
          this.maxZoom, 0,
        ],
      } as Record<string, unknown>,
    });

    // Individual points layer (visible above maxZoom)
    if (this.showPoints) {
      map.addLayer({
        id: this.#pointLayerId,
        type: "circle",
        source: this.#sourceId,
        minzoom: this.maxZoom,
        paint: {
          "circle-radius": [
            "interpolate", ["linear"], ["zoom"],
            this.maxZoom, 2,
            22, 8,
          ],
          "circle-color": this.pointColor,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
          "circle-opacity": [
            "interpolate", ["linear"], ["zoom"],
            this.maxZoom, 0,
            this.maxZoom + 1, 1,
          ],
        },
      });
    }

    this.#layersAdded = true;
  }

  #removeLayers(): void {
    const map = this._mapCtx?.map;
    if (!map) return;
    try {
      if (map.getLayer(this.#pointLayerId)) map.removeLayer(this.#pointLayerId);
      if (map.getLayer(this.#heatmapLayerId)) map.removeLayer(this.#heatmapLayerId);
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

customElements.define(DuiMapHeatmap.tagName, DuiMapHeatmap);
