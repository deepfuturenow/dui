import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

const STORE = { lng: -0.14, lat: 51.5154 };
const HOME = { lng: -0.07, lat: 51.51 };

@customElement("docs-page-map")
export class DocsPageMap extends LitElement {
  protected override createRenderRoot() { return this; }

  @state()
  accessor _markerPos = { lng: -74.006, lat: 40.7128 };

  @state()
  accessor _showPopup = true;

  @state()
  accessor _deliveryRoute: [number, number][] = [];

  @state()
  accessor _truckPos: [number, number] | null = null;

  @state()
  accessor _clickLngLat: { lng: number; lat: number } | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.#fetchDeliveryRoute();
  }

  async #fetchDeliveryRoute(): Promise<void> {
    try {
      const res = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${STORE.lng},${STORE.lat};${HOME.lng},${HOME.lat}?overview=full&geometries=geojson`,
      );
      const data = await res.json();
      const coords: [number, number][] = data.routes?.[0]?.geometry?.coordinates;
      if (coords?.length) {
        this._deliveryRoute = coords;
        this._truckPos = coords[Math.floor(coords.length * 0.6)];
      }
    } catch {
      // Fallback: straight-line route
      this._deliveryRoute = [[STORE.lng, STORE.lat], [HOME.lng, HOME.lat]];
      this._truckPos = [-0.105, 51.512];
    }
  }

  override render() {
    return html`
      <docs-page-layout
        tag="dui-map"
        .additionalTags=${[
          "dui-map-controls",
          "dui-map-marker",
          "dui-map-marker-content",
          "dui-map-marker-popup",
          "dui-map-marker-tooltip",
          "dui-map-marker-label",
          "dui-map-popup",
          "dui-map-route",
          "dui-map-region",
          "dui-map-cluster-layer",
          "dui-map-heatmap",
        ]}
      >

        <!-- Basic map -->
        <dui-docs-demo label="Basic Map" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-74.006, 40.7128] as [number, number]}
            .zoom=${11}
          >
            <dui-map-controls position="bottom-right" show-zoom show-compass></dui-map-controls>
          </dui-map>
        </dui-docs-demo>

        <!-- Markers with popups & tooltips -->
        <dui-docs-demo label="Markers with Popups & Tooltips" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-74.006, 40.7128] as [number, number]}
            .zoom=${12}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>

            <!-- Marker with popup + tooltip -->
            <dui-map-marker .longitude=${-74.006} .latitude=${40.7128}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-popup>
                <div style="padding: var(--space-1);">
                  <strong>New York City</strong>
                  <p style="margin-top: var(--space-1); opacity: 0.7;">The Big Apple 🍎</p>
                </div>
              </dui-map-marker-popup>
              <dui-map-marker-tooltip>
                <span>Click for info</span>
              </dui-map-marker-tooltip>
            </dui-map-marker>

            <!-- Second marker -->
            <dui-map-marker .longitude=${-73.935} .latitude=${40.730}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-popup>
                <div style="padding: var(--space-1);">
                  <strong>Brooklyn</strong>
                  <p style="margin-top: var(--space-1); opacity: 0.7;">East of Manhattan</p>
                </div>
              </dui-map-marker-popup>
            </dui-map-marker>
          </dui-map>
        </dui-docs-demo>

        <!-- Draggable marker -->
        <dui-docs-demo label="Draggable Marker" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-74.006, 40.7128] as [number, number]}
            .zoom=${12}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>
            <dui-map-marker
              .longitude=${this._markerPos.lng}
              .latitude=${this._markerPos.lat}
              draggable
              @dui-marker-dragend=${(e: CustomEvent) => {
                this._markerPos = { lng: e.detail.lng, lat: e.detail.lat };
              }}
            >
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-label position="top">
                <span style="font-size: 10px; font-weight: 500;">Drag me!</span>
              </dui-map-marker-label>
            </dui-map-marker>
          </dui-map>
          <p style="margin-top: var(--space-2); font-size: var(--text-sm); opacity: 0.7;">
            Position: ${this._markerPos.lng.toFixed(4)}, ${this._markerPos.lat.toFixed(4)}
          </p>
        </dui-docs-demo>

        <!-- Standalone popup -->
        <dui-docs-demo label="Standalone Popup" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-74.006, 40.7128] as [number, number]}
            .zoom=${12}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>
            ${this._showPopup ? html`
              <dui-map-popup
                .longitude=${-74.006}
                .latitude=${40.7128}
                close-button
                @dui-map-popup-close=${() => { this._showPopup = false; }}
              >
                <div style="padding: var(--space-1);">
                  <strong>Standalone Popup</strong>
                  <p style="margin-top: var(--space-1); opacity: 0.7;">
                    This popup is placed directly at coordinates, not attached to a marker.
                  </p>
                </div>
              </dui-map-popup>
            ` : ""}
          </dui-map>
          <div style="margin-top: var(--space-2); display: flex; align-items: center; gap: var(--space-2);">
            <dui-button
              size="sm"
              variant="outline"
              ?disabled=${this._showPopup}
              @click=${() => { this._showPopup = true; }}
            >Show popup</dui-button>
            <span style="font-size: var(--text-sm); opacity: 0.7;">
              ${this._showPopup ? "Popup is open — click ✕ to close" : "Popup closed"}
            </span>
          </div>
        </dui-docs-demo>

        <!-- Route — delivery tracker -->
        <dui-docs-demo label="Route Layer" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-0.105, 51.511] as [number, number]}
            .zoom=${12.4}
          >
            ${this._deliveryRoute.length > 0 ? html`
              <dui-map-route
                .coordinates=${this._deliveryRoute}
                color="#4285F4"
                .width=${4}
                .opacity=${0.9}
              ></dui-map-route>
            ` : ""}

            <!-- Store marker (green dot) -->
            <dui-map-marker .longitude=${STORE.lng} .latitude=${STORE.lat}>
              <dui-map-marker-content>
                <div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; background: #22c55e; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>
              </dui-map-marker-content>
              <dui-map-marker-label position="top">
                <span style="font-size: 10px; font-weight: 500;">Store</span>
              </dui-map-marker-label>
            </dui-map-marker>

            <!-- Truck marker -->
            ${this._truckPos ? html`
              <dui-map-marker .longitude=${this._truckPos[0]} .latitude=${this._truckPos[1]}>
                <dui-map-marker-content>
                  <div style="background: #4285F4; border-radius: 50%; padding: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
                  </div>
                </dui-map-marker-content>
                <dui-map-marker-tooltip>
                  <span>On the way</span>
                </dui-map-marker-tooltip>
              </dui-map-marker>
            ` : ""}

            <!-- Home marker (blue dot) -->
            <dui-map-marker .longitude=${HOME.lng} .latitude=${HOME.lat}>
              <dui-map-marker-content>
                <div style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; background: #4285F4; box-shadow: 0 1px 4px rgba(0,0,0,0.3);"></div>
              </dui-map-marker-content>
              <dui-map-marker-label position="top">
                <span style="font-size: 10px; font-weight: 500;">Home</span>
              </dui-map-marker-label>
            </dui-map-marker>
          </dui-map>
        </dui-docs-demo>

        <!-- Region overlay -->
        <dui-docs-demo label="Region Overlay" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-123.12, 49.255] as [number, number]}
            .zoom=${10.25}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>

            <dui-map-region
              region-id="vancouver"
              data="/vancouver.geojson"
              fill-color="rgba(59, 130, 246, 0.25)"
              stroke-color="#3b82f6"
              .strokeWidth=${2}
            ></dui-map-region>

          </dui-map>
        </dui-docs-demo>

        <!-- Cluster layer -->
        <dui-docs-demo label="Cluster Layer" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-98, 39] as [number, number]}
            .zoom=${3}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>
            <dui-map-cluster-layer
              data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
              .clusterRadius=${50}
              .clusterMaxZoom=${14}
              .clusterColors=${["#22c55e", "#eab308", "#ef4444"] as [string, string, string]}
              .clusterThresholds=${[100, 750] as [number, number]}
              point-color="#3b82f6"
            ></dui-map-cluster-layer>
          </dui-map>
        </dui-docs-demo>

        <!-- Constrained Map (min/max zoom + max bounds) -->
        <dui-docs-demo label="Constrained Map" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-73.98, 40.76] as [number, number]}
            .zoom=${13}
            min-zoom="10"
            max-zoom="16"
            .maxBounds=${[[-74.06, 40.68], [-73.86, 40.88]] as [[number, number], [number, number]]}
          >
            <dui-map-controls position="bottom-right" show-zoom show-compass></dui-map-controls>
          </dui-map>
          <p style="margin-top: var(--space-2); font-size: var(--text-sm); opacity: 0.7;">
            This map is locked to Manhattan, zoom 10–16.
          </p>
        </dui-docs-demo>

        <!-- Map Click Events -->
        <dui-docs-demo label="Map Click Events" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-74.006, 40.7128] as [number, number]}
            .zoom=${11}
            @dui-map-click=${(e: CustomEvent) => {
              this._clickLngLat = e.detail.lngLat;
            }}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>
            ${this._clickLngLat ? html`
              <dui-map-marker .longitude=${this._clickLngLat.lng} .latitude=${this._clickLngLat.lat}>
                <dui-map-marker-content></dui-map-marker-content>
              </dui-map-marker>
            ` : ""}
          </dui-map>
          <p style="margin-top: var(--space-2); font-size: var(--text-sm); opacity: 0.7;">
            Last click: ${this._clickLngLat ? `${this._clickLngLat.lng.toFixed(4)}, ${this._clickLngLat.lat.toFixed(4)}` : "Click anywhere on the map"}
          </p>
        </dui-docs-demo>

        <!-- Camera Animation -->
        <dui-docs-demo label="Camera Animation" demo-width="100%">
          <dui-map
            id="camera-map"
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[0, 20] as [number, number]}
            .zoom=${2}
          >
            <dui-map-controls position="bottom-right" show-zoom show-compass></dui-map-controls>
          </dui-map>
          <div style="margin-top: var(--space-2); display: flex; gap: var(--space-2);">
            <dui-button
              size="sm"
              variant="outline"
              @click=${() => {
                const map = this.querySelector<HTMLElement & { flyTo: (o: Record<string, unknown>) => void }>("#camera-map");
                map?.flyTo({ center: [139.6917, 35.6895], zoom: 12, duration: 2000 });
              }}
            >Fly to Tokyo</dui-button>
            <dui-button
              size="sm"
              variant="outline"
              @click=${() => {
                const map = this.querySelector<HTMLElement & { easeTo: (o: Record<string, unknown>) => void }>("#camera-map");
                map?.easeTo({ center: [-0.1276, 51.5074], zoom: 12, duration: 1000 });
              }}
            >Ease to London</dui-button>
          </div>
        </dui-docs-demo>

        <!-- Fit to Markers -->
        <dui-docs-demo label="Fit to Markers" demo-width="100%">
          <dui-map
            id="fit-map"
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-73.98, 40.75] as [number, number]}
            .zoom=${11}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>
            <dui-map-marker .longitude=${-73.985} .latitude=${40.748}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-label position="top"><span style="font-size: 10px;">Empire State</span></dui-map-marker-label>
            </dui-map-marker>
            <dui-map-marker .longitude=${-74.0445} .latitude=${40.6892}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-label position="top"><span style="font-size: 10px;">Statue of Liberty</span></dui-map-marker-label>
            </dui-map-marker>
            <dui-map-marker .longitude=${-73.9857} .latitude=${40.7484}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-label position="top"><span style="font-size: 10px;">Times Square</span></dui-map-marker-label>
            </dui-map-marker>
            <dui-map-marker .longitude=${-73.9654} .latitude=${40.7829}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-label position="top"><span style="font-size: 10px;">Central Park</span></dui-map-marker-label>
            </dui-map-marker>
            <dui-map-marker .longitude=${-73.8680} .latitude=${40.6413}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-label position="top"><span style="font-size: 10px;">JFK Airport</span></dui-map-marker-label>
            </dui-map-marker>
          </dui-map>
          <div style="margin-top: var(--space-2); display: flex; gap: var(--space-2);">
            <dui-button
              size="sm"
              variant="outline"
              @click=${() => {
                const map = this.querySelector<HTMLElement & { fitToMarkers: (o?: Record<string, unknown>) => void }>("#fit-map");
                map?.fitToMarkers({ padding: 60 });
              }}
            >Fit to Markers</dui-button>
            <dui-button
              size="sm"
              variant="outline"
              @click=${() => {
                const map = this.querySelector<HTMLElement & { fitBounds: (b: number[][], o?: Record<string, unknown>) => void }>("#fit-map");
                map?.fitBounds([[-74.06, 40.68], [-73.86, 40.82]], { padding: 40 });
              }}
            >Fit to Manhattan</dui-button>
          </div>
        </dui-docs-demo>

        <!-- Heatmap -->
        <dui-docs-demo label="Heatmap" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[-98, 39] as [number, number]}
            .zoom=${3}
          >
            <dui-map-controls position="bottom-right" show-zoom></dui-map-controls>
            <dui-map-heatmap
              data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
              weight="mag"
              .radius=${20}
              .intensity=${1}
              .opacity=${0.8}
              .maxZoom=${9}
              show-points
              point-color="#3b82f6"
            ></dui-map-heatmap>
          </dui-map>
        </dui-docs-demo>

        <!-- All controls -->
        <dui-docs-demo label="All Controls" demo-width="100%">
          <dui-map
            style="height: 400px; border-radius: var(--radius-lg); overflow: hidden;"
            .center=${[0, 20] as [number, number]}
            .zoom=${2}
          >
            <dui-map-controls
              position="bottom-right"
              show-zoom
              show-compass
              show-locate
              show-fullscreen
            ></dui-map-controls>
          </dui-map>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
