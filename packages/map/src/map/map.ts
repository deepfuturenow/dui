import { css, html, LitElement, type PropertyValues, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { provide } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { mapThemeStyles } from "../theme/map-theme.ts";
import MapLibreGL from "maplibre-gl";
// @ts-ignore — loaded as text via esbuild cssRawTextPlugin
import maplibreCssText from "maplibre-gl/dist/maplibre-gl.css";
import { type MapContext, mapContext } from "./map-context.ts";

const DEFAULT_STYLES = {
  dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
  light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
};

/** Fired when the map viewport changes (pan, zoom, rotate, pitch). */
export const viewportChangeEvent = customEvent<MapViewport>(
  "dui-map-viewport-change",
  { bubbles: true, composed: true },
);

/** Fired when the map finishes initial load. */
export const mapLoadEvent = customEvent<void>(
  "dui-map-load",
  { bubbles: true, composed: true },
);

export type MapClickDetail = {
  lngLat: { lng: number; lat: number };
  point: { x: number; y: number };
};

/** Fired on single click on the map canvas. */
export const mapClickEvent = customEvent<MapClickDetail>(
  "dui-map-click",
  { bubbles: true, composed: true },
);

/** Fired on double-click on the map canvas. */
export const mapDblClickEvent = customEvent<MapClickDetail>(
  "dui-map-dblclick",
  { bubbles: true, composed: true },
);

/** Fired on right-click / long-press on the map canvas. */
export const mapContextMenuEvent = customEvent<MapClickDetail>(
  "dui-map-contextmenu",
  { bubbles: true, composed: true },
);

export type MapViewport = {
  center: [number, number];
  zoom: number;
  bearing: number;
  pitch: number;
};

type Theme = "light" | "dark";

function getDocumentTheme(): Theme | null {
  if (typeof document === "undefined") return null;
  if (document.documentElement.getAttribute("data-theme") === "dark") return "dark";
  if (document.documentElement.getAttribute("data-theme") === "light") return "light";
  // Fallback: check class (for compatibility with next-themes, etc.)
  if (document.documentElement.classList.contains("dark")) return "dark";
  if (document.documentElement.classList.contains("light")) return "light";
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** MapLibre CSS adopted into shadow DOM. */
const maplibreSheet = new CSSStyleSheet();
maplibreSheet.replaceSync(maplibreCssText);

/** Structural styles only — layout and behavioral CSS. */
const styles = css`
  :host {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  }

  [part="container"] {
    width: 100%;
    height: 100%;
    position: relative;
  }

  [part="loader"] {
    position: absolute;
    inset: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader-dots {
    display: flex;
    gap: 4px;
  }

  .loader-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    animation: pulse 1s ease-in-out infinite;
  }

  .loader-dot:nth-child(2) { animation-delay: 150ms; }
  .loader-dot:nth-child(3) { animation-delay: 300ms; }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
`;

/**
 * `<dui-map>` — Root map component wrapping MapLibre GL JS.
 *
 * Initializes a MapLibre map inside its shadow DOM with CSS properly adopted.
 * Provides map context to child components via Lit Context.
 * Auto-detects light/dark theme from `data-theme` attribute on `<html>`.
 *
 * @slot - Map overlay content (controls, markers, popups, routes, etc.)
 * @csspart container - The map container div.
 * @csspart loader - The loading indicator overlay.
 * @fires dui-map-viewport-change - Fired on pan/zoom/rotate/pitch. Detail: MapViewport
 * @fires dui-map-load - Fired when map finishes loading.
 * @fires dui-map-click - Fired on single click. Detail: MapClickDetail
 * @fires dui-map-dblclick - Fired on double-click. Detail: MapClickDetail
 * @fires dui-map-contextmenu - Fired on right-click / long-press. Detail: MapClickDetail
 */
export class DuiMap extends LitElement {
  static tagName = "dui-map" as const;
  static override styles = [base, styles, mapThemeStyles];

  /**
   * Center coordinates as `[longitude, latitude]`.
   * Accepts a JSON array string or is set programmatically.
   */
  @property({ type: Array })
  accessor center: [number, number] = [0, 0];

  /** Zoom level (0–22). */
  @property({ type: Number })
  accessor zoom = 1;

  /** Bearing (rotation) in degrees. */
  @property({ type: Number })
  accessor bearing = 0;

  /** Pitch (tilt) in degrees. */
  @property({ type: Number })
  accessor pitch = 0;

  /** Force a specific theme. When unset, auto-detects from document. */
  @property()
  accessor theme: "light" | "dark" | undefined = undefined;

  /** Custom style URL for light theme. */
  @property({ attribute: "style-light" })
  accessor styleLight: string | undefined = undefined;

  /** Custom style URL for dark theme. */
  @property({ attribute: "style-dark" })
  accessor styleDark: string | undefined = undefined;

  /** Show loading overlay. */
  @property({ type: Boolean })
  accessor loading = false;

  /** Disable world copies (repeating map). */
  @property({ type: Boolean, attribute: "no-world-copies" })
  accessor noWorldCopies = false;

  /** Whether the viewport is controlled externally. */
  @property({ type: Boolean })
  accessor controlled = false;

  /** Minimum zoom level (0–22). */
  @property({ type: Number, attribute: "min-zoom" })
  accessor minZoom = 0;

  /** Maximum zoom level (0–22). */
  @property({ type: Number, attribute: "max-zoom" })
  accessor maxZoom = 22;

  /** SW and NE corners constraining the viewable area. */
  @property({ type: Array })
  accessor maxBounds: [[number, number], [number, number]] | undefined = undefined;

  /** SW and NE corners as [[swLng, swLat], [neLng, neLat]]. Flies to fit when set. */
  @property({ type: Array })
  accessor bounds: [[number, number], [number, number]] | undefined = undefined;

  /** Padding in pixels applied to fitBounds calls. */
  @property({ type: Number, attribute: "bounds-padding" })
  accessor boundsPadding = 50;

  @state()
  accessor #mapInstance: MapLibreGL.Map | null = null;

  @state()
  accessor #isLoaded = false;

  @state()
  accessor #isStyleLoaded = false;

  @state()
  accessor #resolvedTheme: Theme = getDocumentTheme() ?? getSystemTheme();

  #currentStyle: string | null = null;
  #themeObserver: MutationObserver | null = null;
  #mediaQuery: MediaQueryList | null = null;
  #mediaHandler: ((e: MediaQueryListEvent) => void) | null = null;
  #internalUpdate = false;
  #resizeObserver: ResizeObserver | null = null;

  @provide({ context: mapContext })
  @state()
  accessor _ctx: MapContext = { map: null, isLoaded: false };

  #getMapStyle(): string {
    if (this.#resolvedTheme === "dark") {
      return this.styleDark ?? DEFAULT_STYLES.dark;
    }
    return this.styleLight ?? DEFAULT_STYLES.light;
  }

  override connectedCallback(): void {
    super.connectedCallback();

    // Adopt MapLibre CSS into shadow root
    this.shadowRoot!.adoptedStyleSheets = [
      ...this.shadowRoot!.adoptedStyleSheets,
      maplibreSheet,
    ];

    this.#startThemeDetection();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#stopThemeDetection();
    this.#destroyMap();
  }

  override firstUpdated(): void {
    this.#initMap();
  }

  override updated(changed: PropertyValues): void {
    // Theme change → swap style
    if (this.#mapInstance && this.#currentStyle !== this.#getMapStyle()) {
      this.#isStyleLoaded = false;
      this.#currentStyle = this.#getMapStyle();
      this.#mapInstance.setStyle(this.#currentStyle, { diff: true });
    }

    // Controlled viewport sync
    if (this.controlled && this.#mapInstance && !this.#mapInstance.isMoving()) {
      if (changed.has("center") || changed.has("zoom") || changed.has("bearing") || changed.has("pitch")) {
        this.#syncViewport();
      }
    }

    // Min/Max zoom
    if (this.#mapInstance && changed.has("minZoom")) {
      this.#mapInstance.setMinZoom(this.minZoom);
    }
    if (this.#mapInstance && changed.has("maxZoom")) {
      this.#mapInstance.setMaxZoom(this.maxZoom);
    }

    // Max bounds
    if (this.#mapInstance && changed.has("maxBounds")) {
      this.#mapInstance.setMaxBounds(this.maxBounds ?? null);
    }

    // Bounds — fly to fit
    if (this.#mapInstance && changed.has("bounds") && this.bounds) {
      this.fitBounds(this.bounds, { padding: this.boundsPadding, duration: 500 });
    }

    // Update context only when values actually change
    const isLoaded = this.#isLoaded && this.#isStyleLoaded;
    if (this._ctx.map !== this.#mapInstance || this._ctx.isLoaded !== isLoaded) {
      this._ctx = { map: this.#mapInstance, isLoaded };
    }
  }

  /** Get the raw MapLibre GL instance. */
  getMapInstance(): MapLibreGL.Map | null {
    return this.#mapInstance;
  }

  /**
   * Suppress viewport-change events during an animation, then dispatch
   * a single final event on moveend.
   */
  #animateAndDispatch(action: () => void): void {
    if (!this.#mapInstance) return;
    this.#internalUpdate = true;
    action();
    this.#mapInstance.once("moveend", () => {
      this.#internalUpdate = false;
      const c = this.#mapInstance!.getCenter();
      this.dispatchEvent(
        viewportChangeEvent({
          center: [c.lng, c.lat],
          zoom: this.#mapInstance!.getZoom(),
          bearing: this.#mapInstance!.getBearing(),
          pitch: this.#mapInstance!.getPitch(),
        }),
      );
    });
  }

  /** Animate to a position with a parabolic flight path. */
  flyTo(options: {
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    duration?: number;
    curve?: number;
  }): void {
    this.#animateAndDispatch(() => {
      this.#mapInstance!.flyTo({
        ...options,
        duration: options.duration ?? 1500,
        curve: options.curve ?? 1.42,
      });
    });
  }

  /** Animate to a position with a linear ease. */
  easeTo(options: {
    center?: [number, number];
    zoom?: number;
    bearing?: number;
    pitch?: number;
    duration?: number;
  }): void {
    this.#animateAndDispatch(() => {
      this.#mapInstance!.easeTo({
        ...options,
        duration: options.duration ?? 500,
      });
    });
  }

  /** Fly to fit the given bounds. */
  fitBounds(
    bounds: [[number, number], [number, number]],
    options?: { padding?: number; maxZoom?: number; duration?: number },
  ): void {
    this.#animateAndDispatch(() => {
      this.#mapInstance!.fitBounds(bounds, {
        padding: options?.padding ?? this.boundsPadding,
        maxZoom: options?.maxZoom,
        duration: options?.duration ?? 500,
      });
    });
  }

  /** Compute a bounding box from all child dui-map-marker elements and fly to fit them. */
  fitToMarkers(
    options?: { padding?: number; maxZoom?: number; duration?: number },
  ): void {
    const markers = this.querySelectorAll("dui-map-marker");
    if (!markers.length) return;

    let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity;
    for (const marker of markers) {
      const lng = (marker as HTMLElement & { longitude: number }).longitude;
      const lat = (marker as HTMLElement & { latitude: number }).latitude;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }

    this.fitBounds([[minLng, minLat], [maxLng, maxLat]], options);
  }

  #initMap(): void {
    const container = this.shadowRoot!.querySelector<HTMLDivElement>("[part='container']");
    if (!container) return;

    const initialStyle = this.#getMapStyle();
    this.#currentStyle = initialStyle;

    const map = new MapLibreGL.Map({
      container,
      style: initialStyle,
      center: this.center,
      zoom: this.zoom,
      bearing: this.bearing,
      pitch: this.pitch,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      maxBounds: this.maxBounds,
      renderWorldCopies: !this.noWorldCopies,
      attributionControl: { compact: true },
    });

    map.on("load", () => {
      this.#isLoaded = true;
      this.requestUpdate();
      this.dispatchEvent(mapLoadEvent());
    });

    map.on("styledata", () => {
      // Small delay to ensure style is fully processed
      setTimeout(() => {
        this.#isStyleLoaded = true;
        this.requestUpdate();
      }, 100);
    });

    map.on("move", () => {
      if (this.#internalUpdate) return;
      const c = map.getCenter();
      this.dispatchEvent(
        viewportChangeEvent({
          center: [c.lng, c.lat],
          zoom: map.getZoom(),
          bearing: map.getBearing(),
          pitch: map.getPitch(),
        }),
      );
    });

    // Map interaction events
    map.on("click", (e) => {
      this.dispatchEvent(mapClickEvent({
        lngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
        point: { x: e.point.x, y: e.point.y },
      }));
    });

    map.on("dblclick", (e) => {
      this.dispatchEvent(mapDblClickEvent({
        lngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
        point: { x: e.point.x, y: e.point.y },
      }));
    });

    map.on("contextmenu", (e) => {
      this.dispatchEvent(mapContextMenuEvent({
        lngLat: { lng: e.lngLat.lng, lat: e.lngLat.lat },
        point: { x: e.point.x, y: e.point.y },
      }));
    });

    // ResizeObserver so map resizes when host element resizes
    this.#resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    this.#resizeObserver.observe(this);

    this.#mapInstance = map;
    // Context is updated in updated() — just trigger re-render
    this.requestUpdate();
  }

  #destroyMap(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    if (this.#mapInstance) {
      this.#mapInstance.remove();
      this.#mapInstance = null;
    }
    this.#isLoaded = false;
    this.#isStyleLoaded = false;
    this._ctx = { map: null, isLoaded: false };
  }

  #syncViewport(): void {
    const map = this.#mapInstance!;
    const current = map.getCenter();
    const c = this.center;
    if (
      current.lng === c[0] &&
      current.lat === c[1] &&
      map.getZoom() === this.zoom &&
      map.getBearing() === this.bearing &&
      map.getPitch() === this.pitch
    ) return;

    this.#internalUpdate = true;
    map.jumpTo({
      center: this.center,
      zoom: this.zoom,
      bearing: this.bearing,
      pitch: this.pitch,
    });
    this.#internalUpdate = false;
  }

  #startThemeDetection(): void {
    if (this.theme) {
      this.#resolvedTheme = this.theme;
      return;
    }

    // Watch data-theme and class changes on <html>
    this.#themeObserver = new MutationObserver(() => {
      const docTheme = getDocumentTheme();
      if (docTheme) this.#resolvedTheme = docTheme;
    });
    this.#themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    // Watch system preference
    this.#mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.#mediaHandler = (e: MediaQueryListEvent) => {
      if (!getDocumentTheme()) {
        this.#resolvedTheme = e.matches ? "dark" : "light";
      }
    };
    this.#mediaQuery.addEventListener("change", this.#mediaHandler);
  }

  #stopThemeDetection(): void {
    this.#themeObserver?.disconnect();
    this.#themeObserver = null;
    if (this.#mediaQuery && this.#mediaHandler) {
      this.#mediaQuery.removeEventListener("change", this.#mediaHandler);
    }
    this.#mediaQuery = null;
    this.#mediaHandler = null;
  }

  override render(): TemplateResult {
    return html`
      <div part="container">
        ${(!this.#isLoaded || this.loading) ? html`
          <div part="loader">
            <div class="loader-dots">
              <div class="loader-dot"></div>
              <div class="loader-dot"></div>
              <div class="loader-dot"></div>
            </div>
          </div>
        ` : ""}
        ${this.#mapInstance ? html`<slot></slot>` : ""}
      </div>
    `;
  }
}

customElements.define(DuiMap.tagName, DuiMap);
