import { css, LitElement, type PropertyValues, type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import type MapLibreGL from "maplibre-gl";
import { type MapContext, mapContext } from "../map/map-context.ts";

/** Fired when an unclustered point is clicked. */
export const pointClickEvent = customEvent<{
  feature: GeoJSON.Feature<GeoJSON.Point>;
  coordinates: [number, number];
}>("dui-cluster-point-click", { bubbles: true, composed: true });

/** Fired when a cluster is clicked. */
export const clusterClickEvent = customEvent<{
  clusterId: number;
  coordinates: [number, number];
  pointCount: number;
}>("dui-cluster-click", { bubbles: true, composed: true });

const styles = css`
  :host {
    display: contents;
  }
`;

/**
 * `<dui-map-cluster-layer>` — Clustered point visualization on the map.
 *
 * Accepts a GeoJSON FeatureCollection (or URL string) and renders clustered circles
 * with automatic zoom-to-cluster on click.
 *
 * @fires dui-cluster-point-click - Fired when an unclustered point is clicked.
 * @fires dui-cluster-click - Fired when a cluster is clicked.
 */
export class DuiMapClusterLayer extends LitElement {
  static tagName = "dui-map-cluster-layer" as const;
  static override styles = [base, styles];

  /** GeoJSON data URL or inline FeatureCollection. */
  @property({ type: String })
  accessor data: string | GeoJSON.FeatureCollection<GeoJSON.Point> = "";

  /** Maximum zoom level to cluster points on. */
  @property({ type: Number, attribute: "cluster-max-zoom" })
  accessor clusterMaxZoom = 14;

  /** Radius of each cluster when clustering points in pixels. */
  @property({ type: Number, attribute: "cluster-radius" })
  accessor clusterRadius = 50;

  /** Colors for cluster circles: `[small, medium, large]`. */
  @property({ type: Array, attribute: "cluster-colors" })
  accessor clusterColors: [string, string, string] = ["#22c55e", "#eab308", "#ef4444"];

  /** Point count thresholds for color/size steps: `[medium, large]`. */
  @property({ type: Array, attribute: "cluster-thresholds" })
  accessor clusterThresholds: [number, number] = [100, 750];

  /** Color for unclustered individual points. */
  @property({ attribute: "point-color" })
  accessor pointColor = "#3b82f6";

  /** Unique identifier. Auto-generated if not set. */
  @property({ attribute: "cluster-id" })
  accessor clusterId: string = `cluster-${Math.random().toString(36).slice(2, 9)}`;

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  #sourceId = "";
  #clusterLayerId = "";
  #clusterCountLayerId = "";
  #unclusteredLayerId = "";
  #layersAdded = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#sourceId = `cluster-source-${this.clusterId}`;
    this.#clusterLayerId = `clusters-${this.clusterId}`;
    this.#clusterCountLayerId = `cluster-count-${this.clusterId}`;
    this.#unclusteredLayerId = `unclustered-point-${this.clusterId}`;
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

    // Update layer styles
    if (changed.has("clusterColors") || changed.has("clusterThresholds")) {
      if (map.getLayer(this.#clusterLayerId)) {
        map.setPaintProperty(this.#clusterLayerId, "circle-color", [
          "step",
          ["get", "point_count"],
          this.clusterColors[0],
          this.clusterThresholds[0],
          this.clusterColors[1],
          this.clusterThresholds[1],
          this.clusterColors[2],
        ]);
        map.setPaintProperty(this.#clusterLayerId, "circle-radius", [
          "step",
          ["get", "point_count"],
          20,
          this.clusterThresholds[0],
          30,
          this.clusterThresholds[1],
          40,
        ]);
      }
    }

    if (changed.has("pointColor")) {
      if (map.getLayer(this.#unclusteredLayerId)) {
        map.setPaintProperty(this.#unclusteredLayerId, "circle-color", this.pointColor);
      }
    }
  }

  #addLayers(map: MapLibreGL.Map): void {
    if (map.getSource(this.#sourceId)) return;

    map.addSource(this.#sourceId, {
      type: "geojson",
      data: this.data as string | GeoJSON.FeatureCollection,
      cluster: true,
      clusterMaxZoom: this.clusterMaxZoom,
      clusterRadius: this.clusterRadius,
    });

    // Cluster circles
    map.addLayer({
      id: this.#clusterLayerId,
      type: "circle",
      source: this.#sourceId,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          this.clusterColors[0],
          this.clusterThresholds[0],
          this.clusterColors[1],
          this.clusterThresholds[1],
          this.clusterColors[2],
        ],
        "circle-radius": [
          "step",
          ["get", "point_count"],
          20,
          this.clusterThresholds[0],
          30,
          this.clusterThresholds[1],
          40,
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#fff",
        "circle-opacity": 0.85,
      },
    });

    // Cluster count text
    map.addLayer({
      id: this.#clusterCountLayerId,
      type: "symbol",
      source: this.#sourceId,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 12,
      },
      paint: {
        "text-color": "#fff",
      },
    });

    // Unclustered points
    map.addLayer({
      id: this.#unclusteredLayerId,
      type: "circle",
      source: this.#sourceId,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-color": this.pointColor,
        "circle-radius": 5,
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    // Click handlers
    map.on("click", this.#clusterLayerId, async (e: MapLibreGL.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [this.#clusterLayerId],
      });
      if (!features.length) return;

      const feature = features[0];
      const cid = feature.properties?.cluster_id as number;
      const pointCount = feature.properties?.point_count as number;
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

      this.dispatchEvent(clusterClickEvent({ clusterId: cid, coordinates, pointCount }));

      // Default: zoom to cluster expansion zoom
      const source = map.getSource(this.#sourceId) as MapLibreGL.GeoJSONSource;
      const zoom = await source.getClusterExpansionZoom(cid);
      map.easeTo({ center: coordinates, zoom });
    });

    map.on("click", this.#unclusteredLayerId, (e: MapLibreGL.MapMouseEvent & { features?: MapLibreGL.MapGeoJSONFeature[] }) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number];

      // Handle world copies
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      this.dispatchEvent(pointClickEvent({
        feature: feature as unknown as GeoJSON.Feature<GeoJSON.Point>,
        coordinates,
      }));
    });

    // Cursor handlers
    map.on("mouseenter", this.#clusterLayerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", this.#clusterLayerId, () => {
      map.getCanvas().style.cursor = "";
    });
    map.on("mouseenter", this.#unclusteredLayerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", this.#unclusteredLayerId, () => {
      map.getCanvas().style.cursor = "";
    });

    this.#layersAdded = true;
  }

  #removeLayers(): void {
    const map = this._mapCtx?.map;
    if (!map) return;
    try {
      if (map.getLayer(this.#clusterCountLayerId)) map.removeLayer(this.#clusterCountLayerId);
      if (map.getLayer(this.#unclusteredLayerId)) map.removeLayer(this.#unclusteredLayerId);
      if (map.getLayer(this.#clusterLayerId)) map.removeLayer(this.#clusterLayerId);
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
