import { css, html, LitElement, type TemplateResult, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { mapControlsThemeStyles } from "../theme/map-theme.ts";
import { type MapContext, mapContext } from "../map/map-context.ts";

/** Fired when the user's geolocation is found. */
export const locateEvent = customEvent<{ longitude: number; latitude: number }>(
  "dui-map-locate",
  { bubbles: true, composed: true },
);

/** Structural styles only. */
const styles = css`
  :host {
    display: block;
    position: absolute;
    z-index: 10;
  }

  :host([position="top-left"]) { top: var(--space-2, 8px); left: var(--space-2, 8px); }
  :host([position="top-right"]) { top: var(--space-2, 8px); right: var(--space-2, 8px); }
  :host([position="bottom-left"]) { bottom: var(--space-2, 8px); left: var(--space-2, 8px); }
  :host,
  :host([position=""]),
  :host([position="bottom-right"]) { bottom: var(--space-8, 32px); right: var(--space-2, 8px); }

  [part="root"] {
    display: flex;
    flex-direction: column;
    gap: var(--space-1_5, 6px);
  }

  [part="group"] {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  [part="control-button"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    font: inherit;
    color: inherit;
  }

  [part="control-button"]:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }

  /* Compass SVG */
  .compass-svg {
    width: 20px;
    height: 20px;
    transition: transform 200ms;
    transform-style: preserve-3d;
  }

  /* Icon SVGs */
  .icon-svg {
    width: 16px;
    height: 16px;
  }
`;

/**
 * `<dui-map-controls>` — Zoom, compass, locate, and fullscreen controls.
 *
 * @csspart root - The outer controls wrapper.
 * @csspart group - A control group container.
 * @csspart control-button - Individual control buttons.
 * @fires dui-map-locate - Fired with user coordinates when located.
 */
export class DuiMapControls extends LitElement {
  static tagName = "dui-map-controls" as const;
  static override styles = [base, styles, mapControlsThemeStyles];

  /** Position on the map. */
  @property({ reflect: true })
  accessor position: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "bottom-right";

  /** Show zoom in/out buttons. */
  @property({ type: Boolean, attribute: "show-zoom" })
  accessor showZoom = true;

  /** Show compass button to reset bearing. */
  @property({ type: Boolean, attribute: "show-compass" })
  accessor showCompass = false;

  /** Show locate button to find user's location. */
  @property({ type: Boolean, attribute: "show-locate" })
  accessor showLocate = false;

  /** Show fullscreen toggle button. */
  @property({ type: Boolean, attribute: "show-fullscreen" })
  accessor showFullscreen = false;

  @consume({ context: mapContext, subscribe: true })
  accessor _mapCtx!: MapContext;

  @state()
  accessor #waitingForLocation = false;

  #compassEl: SVGSVGElement | null = null;
  #rotateHandler: (() => void) | null = null;
  #pitchHandler: (() => void) | null = null;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#removeCompassListeners();
  }

  override updated(): void {
    if (this.showCompass && this._mapCtx?.map) {
      this.#setupCompassListeners();
    }
  }

  #setupCompassListeners(): void {
    this.#removeCompassListeners();
    const map = this._mapCtx?.map;
    if (!map) return;

    this.#compassEl = this.shadowRoot!.querySelector<SVGSVGElement>(".compass-svg");
    if (!this.#compassEl) return;

    const update = () => {
      if (!this.#compassEl) return;
      const bearing = map.getBearing();
      const pitch = map.getPitch();
      this.#compassEl.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
    };

    this.#rotateHandler = update;
    this.#pitchHandler = update;
    map.on("rotate", this.#rotateHandler);
    map.on("pitch", this.#pitchHandler);
    update();
  }

  #removeCompassListeners(): void {
    const map = this._mapCtx?.map;
    if (!map) return;
    if (this.#rotateHandler) map.off("rotate", this.#rotateHandler);
    if (this.#pitchHandler) map.off("pitch", this.#pitchHandler);
    this.#rotateHandler = null;
    this.#pitchHandler = null;
  }

  #handleZoomIn = (): void => {
    this._mapCtx?.map?.zoomTo(this._mapCtx.map.getZoom() + 1, { duration: 300 });
  };

  #handleZoomOut = (): void => {
    this._mapCtx?.map?.zoomTo(this._mapCtx.map.getZoom() - 1, { duration: 300 });
  };

  #handleResetBearing = (): void => {
    this._mapCtx?.map?.resetNorthPitch({ duration: 300 });
  };

  #handleLocate = (): void => {
    this.#waitingForLocation = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude,
          };
          this._mapCtx?.map?.flyTo({
            center: [coords.longitude, coords.latitude],
            zoom: 14,
            duration: 1500,
          });
          this.dispatchEvent(locateEvent(coords));
          this.#waitingForLocation = false;
        },
        (error) => {
          console.error("Error getting location:", error);
          this.#waitingForLocation = false;
        },
      );
    }
  };

  #handleFullscreen = (): void => {
    const map = this._mapCtx?.map;
    if (!map) return;
    const container = map.getContainer();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  };

  // SVG icon templates

  #plusIcon(): TemplateResult {
    return html`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  }

  #minusIcon(): TemplateResult {
    return html`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  }

  #locateIcon(): TemplateResult {
    return html`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>`;
  }

  #maximizeIcon(): TemplateResult {
    return html`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>`;
  }

  #spinnerIcon(): TemplateResult {
    return html`<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="animation: spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;
  }

  #compassIcon(): TemplateResult {
    return html`
      <svg class="compass-svg" viewBox="0 0 24 24">
        <path d="M12 2L16 12H12V2Z" fill="var(--map-compass-north, #ef4444)" />
        <path d="M12 2L8 12H12V2Z" fill="var(--map-compass-north-light, #fca5a5)" />
        <path d="M12 22L16 12H12V22Z" fill="var(--map-compass-south, currentColor)" opacity="0.6" />
        <path d="M12 22L8 12H12V22Z" fill="var(--map-compass-south, currentColor)" opacity="0.3" />
      </svg>
    `;
  }

  override render(): TemplateResult {
    return html`
      <div part="root">
        ${this.showZoom ? html`
          <div part="group">
            <button part="control-button" aria-label="Zoom in" @click=${this.#handleZoomIn}>
              ${this.#plusIcon()}
            </button>
            <button part="control-button" aria-label="Zoom out" @click=${this.#handleZoomOut}>
              ${this.#minusIcon()}
            </button>
          </div>
        ` : nothing}

        ${this.showCompass ? html`
          <div part="group">
            <button part="control-button" aria-label="Reset bearing to north" @click=${this.#handleResetBearing}>
              ${this.#compassIcon()}
            </button>
          </div>
        ` : nothing}

        ${this.showLocate ? html`
          <div part="group">
            <button part="control-button" aria-label="Find my location" ?disabled=${this.#waitingForLocation} @click=${this.#handleLocate}>
              ${this.#waitingForLocation ? this.#spinnerIcon() : this.#locateIcon()}
            </button>
          </div>
        ` : nothing}

        ${this.showFullscreen ? html`
          <div part="group">
            <button part="control-button" aria-label="Toggle fullscreen" @click=${this.#handleFullscreen}>
              ${this.#maximizeIcon()}
            </button>
          </div>
        ` : nothing}
      </div>
    `;
  }
}

customElements.define(DuiMapControls.tagName, DuiMapControls);
