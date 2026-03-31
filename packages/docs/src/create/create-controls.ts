import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FONT_OPTIONS, RADIUS_PRESETS, ICON_LIBRARIES } from "./create-config.ts";

@customElement("create-controls")
export class CreateControls extends LitElement {
  static override styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-6, 1.5rem);
      padding: var(--space-6, 1.5rem) var(--space-4);
    }

    .control-group label {
      display: block;
      font-size: var(--font-size-xs, 0.75rem);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: var(--letter-spacing-wider, 0.05em);
      color: var(--muted-foreground);
      margin-bottom: var(--space-2);
      font-family: var(--font-mono);
    }

    /* Font selector */
    .font-select {
      width: 100%;
      padding: var(--space-2) var(--space-2_5, 0.625rem);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      background: var(--background);
      color: var(--foreground);
      font-size: var(--font-size-sm, 0.875rem);
      cursor: pointer;
    }

    /* Radius buttons */
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
      color: var(--muted-foreground);
      font-size: var(--font-size-xs, 0.75rem);
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

    /* Icon library selector */
    .icon-select {
      width: 100%;
      padding: var(--space-2) var(--space-2_5, 0.625rem);
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-md, 0.5rem);
      background: var(--background);
      color: var(--foreground);
      font-size: var(--font-size-sm, 0.875rem);
      cursor: pointer;
    }
  `;

  @property()
  accessor selectedFont = "Geist";

  @property()
  accessor selectedRadius = "0.5rem";

  @property()
  accessor selectedIconLib = "Lucide";

  #emitChange(prop: string, value: string) {
    this.dispatchEvent(
      new CustomEvent("control-change", {
        detail: { prop, value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  override render() {
    return html`
      <div class="control-group">
        <label>Font</label>
        <select
          class="font-select"
          @change=${(e: Event) => this.#emitChange("font", (e.target as HTMLSelectElement).value)}
        >
          ${FONT_OPTIONS.map(
            (f) => html`
              <option value=${f.family} ?selected=${f.family === this.selectedFont}>
                ${f.family}
              </option>
            `,
          )}
        </select>
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

      <div class="control-group">
        <label>Icon Library</label>
        <select
          class="icon-select"
          @change=${(e: Event) => this.#emitChange("iconLib", (e.target as HTMLSelectElement).value)}
        >
          ${ICON_LIBRARIES.map(
            (lib) => html`
              <option value=${lib} ?selected=${lib === this.selectedIconLib}>
                ${lib}
              </option>
            `,
          )}
        </select>
      </div>
    `;
  }
}
