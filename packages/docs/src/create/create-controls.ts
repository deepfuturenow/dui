import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  SANS_FONT_OPTIONS,
  SERIF_FONT_OPTIONS,
  MONO_FONT_OPTIONS,
  RADIUS_PRESETS,
  COLOR_PRIMITIVES,
} from "./create-config.ts";
import { formatOklch, type Oklch } from "./color-utils.ts";

@customElement("create-controls")
export class CreateControls extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-6, 1.5rem);
      padding: var(--space-6, 1.5rem) var(--space-4);
    }

    .control-group > label {
      display: block;
      font-size: var(--text-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider, 0.05em);
      color: var(--text-2);
      margin-bottom: var(--space-2);
      font-family: var(--font-mono);
    }

    /* ── Color controls ── */
    .color-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 1rem);
    }

    .color-item-header {
      display: flex;
      align-items: center;
      gap: var(--space-2, 0.5rem);
      margin-bottom: var(--space-1_5, 0.375rem);
    }

    .color-swatch {
      width: 24px;
      height: 24px;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      flex-shrink: 0;
    }

    .color-label {
      font-size: var(--text-sm, 0.875rem);
      color: var(--text-1);
    }

    .color-channels {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--space-1_5, 0.375rem);
    }

    .channel {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .channel-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-3);
      font-family: var(--font-mono);
    }

    .channel-input {
      width: 100%;
      padding: var(--space-1, 0.25rem) var(--space-1_5, 0.375rem);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      background: var(--background);
      color: var(--foreground);
      font-size: var(--text-xs, 0.75rem);
      font-family: var(--font-mono);
      text-align: center;
      box-sizing: border-box;
      /* Hide spin buttons */
      -moz-appearance: textfield;
    }

    .channel-input::-webkit-inner-spin-button,
    .channel-input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .channel-input:focus {
      outline: 2px solid var(--accent);
      outline-offset: -1px;
    }

    /* ── Font selectors ── */
    .font-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-3, 0.75rem);
    }

    .font-row label {
      font-size: var(--text-xs, 0.75rem);
      font-weight: 500;
      text-transform: none;
      letter-spacing: normal;
      color: var(--text-3);
      margin-bottom: var(--space-1);
    }

    .font-select {
      width: 100%;
      padding: var(--space-2) var(--space-2_5, 0.625rem);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      background: var(--background);
      color: var(--foreground);
      font-size: var(--text-sm, 0.875rem);
      cursor: pointer;
    }

    /* ── Radius buttons ── */
    .radius-options {
      display: flex;
      gap: var(--space-1);
    }

    .radius-btn {
      flex: 1;
      padding: var(--space-1_5, 0.375rem) 0;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-sm, 0.25rem);
      background: transparent;
      color: var(--text-2);
      font-size: var(--text-xs, 0.75rem);
      cursor: pointer;
      text-align: center;
      transition: background-color 0.15s, color 0.15s, border-color 0.15s;
    }

    .radius-btn:hover {
      background: var(--accent, oklch(0.5 0 0 / 0.05));
    }

    .radius-btn[aria-pressed="true"] {
      background: var(--foreground);
      color: var(--background);
      border-color: var(--foreground);
    }
  `;

  @property()
  accessor selectedFontSans = "Geist";

  @property()
  accessor selectedFontSerif = "Lora";

  @property()
  accessor selectedFontMono = "Geist Mono";

  @property()
  accessor selectedRadius = "0.5rem";

  /** OKLCH values keyed by token name, e.g. { "--accent": { l: 0.55, c: 0.25, h: 260 } } */
  @property({ type: Object })
  accessor colors: Record<string, Oklch> = {};

  #emitChange(prop: string, value: string) {
    this.dispatchEvent(
      new CustomEvent("control-change", {
        detail: { prop, value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #onChannelInput(token: string, channel: "l" | "c" | "h", e: Event) {
    const input = e.target as HTMLInputElement;
    const val = parseFloat(input.value);
    if (Number.isNaN(val)) return;
    const current = this.colors[token] ?? { l: 0.5, c: 0, h: 0 };
    const updated: Oklch = { ...current, [channel]: val };
    this.#emitChange(`color:${token}`, formatOklch(updated));
  }

  override render() {
    return html`
      <div class="control-group">
        <label>Colors</label>
        <div class="color-group">
          ${COLOR_PRIMITIVES.map((c) => {
            const oklch = this.colors[c.token] ?? { l: 0.5, c: 0, h: 0 };
            const cssColor = formatOklch(oklch);
            return html`
              <div class="color-item">
                <div class="color-item-header">
                  <div class="color-swatch" style="background-color: ${cssColor}"></div>
                  <span class="color-label">${c.label}</span>
                </div>
                <div class="color-channels">
                  <div class="channel">
                    <span class="channel-label">L</span>
                    <input
                      type="number"
                      class="channel-input"
                      .value=${oklch.l.toFixed(2)}
                      min="0" max="1" step="0.01"
                      @change=${(e: Event) => this.#onChannelInput(c.token, "l", e)}
                    />
                  </div>
                  <div class="channel">
                    <span class="channel-label">C</span>
                    <input
                      type="number"
                      class="channel-input"
                      .value=${oklch.c.toFixed(2)}
                      min="0" max="0.4" step="0.01"
                      @change=${(e: Event) => this.#onChannelInput(c.token, "c", e)}
                    />
                  </div>
                  <div class="channel">
                    <span class="channel-label">H</span>
                    <input
                      type="number"
                      class="channel-input"
                      .value=${Math.round(oklch.h).toString()}
                      min="0" max="360" step="1"
                      @change=${(e: Event) => this.#onChannelInput(c.token, "h", e)}
                    />
                  </div>
                </div>
              </div>
            `;
          })}
        </div>
      </div>

      <div class="control-group">
        <label>Font</label>
        <div class="font-group">
          <div class="font-row">
            <label>Sans-serif</label>
            <select
              class="font-select"
              @change=${(e: Event) => this.#emitChange("fontSans", (e.target as HTMLSelectElement).value)}
            >
              ${SANS_FONT_OPTIONS.map(
                (f) => html`
                  <option value=${f.family} ?selected=${f.family === this.selectedFontSans}>
                    ${f.family}
                  </option>
                `,
              )}
            </select>
          </div>
          <div class="font-row">
            <label>Serif</label>
            <select
              class="font-select"
              @change=${(e: Event) => this.#emitChange("fontSerif", (e.target as HTMLSelectElement).value)}
            >
              ${SERIF_FONT_OPTIONS.map(
                (f) => html`
                  <option value=${f.family} ?selected=${f.family === this.selectedFontSerif}>
                    ${f.family}
                  </option>
                `,
              )}
            </select>
          </div>
          <div class="font-row">
            <label>Monospace</label>
            <select
              class="font-select"
              @change=${(e: Event) => this.#emitChange("fontMono", (e.target as HTMLSelectElement).value)}
            >
              ${MONO_FONT_OPTIONS.map(
                (f) => html`
                  <option value=${f.family} ?selected=${f.family === this.selectedFontMono}>
                    ${f.family}
                  </option>
                `,
              )}
            </select>
          </div>
        </div>
      </div>

      <div class="control-group">
        <label>Radius</label>
        <div class="radius-options">
          ${RADIUS_PRESETS.map(
            (r) => html`
              <button
                class="radius-btn"
                aria-pressed=${r.value === this.selectedRadius ? "true" : "false"}
                @click=${() => this.#emitChange("radius", r.value)}
              >
                ${r.label}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}
