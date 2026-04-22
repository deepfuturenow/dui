import { LitElement, html, css, svg } from "lit";
import { blockBase } from "./block-base.ts";
import { customElement, state } from "lit/decorators.js";

/* ── Location data ── */

interface Location {
  name: string;
  address: string;
  lng: number;
  lat: number;
  hours: string;
}

const LOCATIONS: Location[] = [
  {
    name: "Soho Flagship",
    address: "87 Grand St, New York",
    lng: -74.0015,
    lat: 40.7218,
    hours: "9 am – 8 pm",
  },
  {
    name: "Williamsburg",
    address: "142 Bedford Ave, Brooklyn",
    lng: -73.9572,
    lat: 40.7182,
    hours: "10 am – 7 pm",
  },
  {
    name: "Chelsea Market",
    address: "75 9th Ave, New York",
    lng: -74.0055,
    lat: 40.7425,
    hours: "8 am – 9 pm",
  },
];

/* ── Icons ── */

const pinIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`;

const clockIcon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

/* ── Component ── */

@customElement("block-map")
export class BlockMap extends LitElement {
  static override styles = [blockBase, css`
    :host {
      overflow: hidden;
    }

    .map-wrap {
      height: 14rem;
      position: relative;
    }

    dui-map {
      width: 100%;
      height: 100%;
    }

    .body {
      padding: var(--space-4) var(--space-5) var(--space-5);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-4);
    }

    .title {
      font-size: var(--text-base);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .count {
      font-size: var(--text-xs);
      color: var(--text-2);
      background: var(--surface-2);
      padding: var(--space-0_5) var(--space-2);
      border-radius: var(--radius-full);
    }

    .locations {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }

    .location {
      display: flex;
      gap: var(--space-3);
      padding: var(--space-3);
      background: var(--sunken-1);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: background 0.15s;
    }

    .location:hover {
      outline: var(--border-width-thin) solid var(--border-strong);
      outline-offset: -1px;
    }

    .location.active {
      background: var(--surface-2);
      outline: var(--border-width-thin) solid var(--accent);
      outline-offset: -1px;
    }

    .loc-icon {
      width: var(--space-4);
      height: var(--space-4);
      flex-shrink: 0;
      color: var(--accent);
      margin-top: var(--space-0_5);
    }

    .loc-info {
      flex: 1;
      min-width: 0;
    }

    .loc-name {
      font-size: var(--text-sm);
      font-weight: var(--font-weight-medium);
      margin: 0 0 var(--space-2);
    }

    .loc-address {
      font-size: var(--text-xs);
      color: var(--text-2);
      margin: 0;
    }

    .loc-hours {
      display: flex;
      align-items: center;
      gap: var(--space-1);
      font-size: var(--text-xs);
      color: var(--text-3);
      margin-top: var(--space-1);
    }

    .loc-hours svg {
      width: var(--space-3);
      height: var(--space-3);
    }
  `];

  @state()
  accessor #activeIndex = 0;

  #handleLocationClick(index: number) {
    this.#activeIndex = index;

    // Fly the map to the selected location
    const map = this.renderRoot.querySelector("dui-map") as HTMLElement & {
      flyTo: (opts: { center: [number, number]; zoom: number; duration: number }) => void;
    } | null;
    if (map?.flyTo) {
      const loc = LOCATIONS[index];
      map.flyTo({ center: [loc.lng, loc.lat], zoom: 14, duration: 800 });
    }
  }

  override render() {
    const active = LOCATIONS[this.#activeIndex];

    return html`
      <div class="map-wrap">
        <dui-map
          .center=${[active.lng, active.lat] as [number, number]}
          .zoom=${12}
        >
          <dui-map-controls position="top-right" show-zoom></dui-map-controls>
          ${LOCATIONS.map((loc) => html`
            <dui-map-marker .longitude=${loc.lng} .latitude=${loc.lat}>
              <dui-map-marker-content></dui-map-marker-content>
              <dui-map-marker-tooltip>
                <span>${loc.name}</span>
              </dui-map-marker-tooltip>
            </dui-map-marker>
          `)}
        </dui-map>
      </div>

      <div class="body">
        <div class="header">
          <p class="title">Nearby Locations</p>
          <span class="count">${LOCATIONS.length} found</span>
        </div>

        <div class="locations">
          ${LOCATIONS.map((loc, i) => html`
            <div
              class="location ${i === this.#activeIndex ? "active" : ""}"
              @click=${() => this.#handleLocationClick(i)}
            >
              <div class="loc-icon">${pinIcon}</div>
              <div class="loc-info">
                <p class="loc-name">${loc.name}</p>
                <p class="loc-address">${loc.address}</p>
                <div class="loc-hours">
                  ${clockIcon}
                  <span>${loc.hours}</span>
                </div>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
