/**
 * OKLCH Editor — L/C/H/A sliders + swatch for color tokens
 *
 * Uses native <input type="range"> for L, C, H channels plus an optional
 * alpha slider. Swatch preview and a raw text input for direct editing.
 */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { parseOklch, composeOklch } from "../lib/token-parser.ts";

@customElement("oklch-editor")
export class OklchEditorElement extends LitElement {
  static override styles = [
    base,
    css`
      :host {
        display: block;
      }

      .slider-grid {
        display: grid;
        grid-template-columns: 20px 1fr auto;
        gap: var(--space-1) var(--space-2);
        align-items: center;
      }

      .label {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--text-2);
        text-transform: uppercase;
      }

      input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: var(--space-1);
        background: var(--surface-1);
        border-radius: var(--radius-full);
        outline: none;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: var(--space-3_5);
        height: var(--space-3_5);
        border-radius: 50%;
        background: var(--foreground);
        border: 2px solid var(--background);
        box-shadow: 0 0 0 1px var(--border);
        cursor: pointer;
      }

      input[type="range"]::slider-thumb {
        width: var(--space-3_5);
        height: var(--space-3_5);
        border-radius: 50%;
        background: var(--foreground);
        border: 2px solid var(--background);
        box-shadow: 0 0 0 1px var(--border);
        cursor: pointer;
      }

      .value-display {
        font-size: var(--font-size-xs);
        font-family: var(--font-mono);
        color: var(--text-2);
        min-width: 44px;
        text-align: right;
      }

      .swatch-row {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        margin-top: var(--space-1_5);
      }

      .swatch {
        width: 28px;
        height: 28px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border);
        flex-shrink: 0;
      }

      .raw-input {
        flex: 1;
        font-size: var(--font-size-xs);
        font-family: var(--font-mono);
        padding: var(--space-1) var(--space-1_5);
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--sunken);
        color: var(--foreground);
        min-width: 0;
      }

      .raw-input:focus {
        outline: 2px solid var(--ring);
        outline-offset: -1px;
        border-color: transparent;
      }
    `,
  ];

  @property({ type: String }) accessor value = "";

  @state() accessor l = 0;
  @state() accessor c = 0;
  @state() accessor h = 0;
  @state() accessor alpha: number | undefined = undefined;
  @state() accessor hasAlpha = false;

  override willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("value")) {
      this.#parseValue();
    }
  }

  #parseValue = (): void => {
    const parsed = parseOklch(this.value);
    if (parsed) {
      this.l = parsed.l;
      this.c = parsed.c;
      this.h = parsed.h;
      this.alpha = parsed.alpha;
      if (parsed.alpha !== undefined) {
        this.hasAlpha = true;
      }
    }
  };

  #emitChange = (): void => {
    const value = composeOklch(this.l, this.c, this.h, this.alpha);
    this.dispatchEvent(
      new CustomEvent("token-change", { detail: { value }, bubbles: true, composed: true }),
    );
  };

  #onSliderInput = (channel: "l" | "c" | "h" | "a") =>
    (e: Event): void => {
      const input = e.target as HTMLInputElement;
      const val = parseFloat(input.value);
      if (channel === "l") this.l = val;
      else if (channel === "c") this.c = val;
      else if (channel === "h") this.h = val;
      else this.alpha = val;
      this.#emitChange();
    };

  #onRawInput = (e: Event): void => {
    const input = e.target as HTMLInputElement;
    const parsed = parseOklch(input.value);
    if (parsed) {
      this.l = parsed.l;
      this.c = parsed.c;
      this.h = parsed.h;
      this.alpha = parsed.alpha;
      if (parsed.alpha !== undefined) {
        this.hasAlpha = true;
      }
      this.#emitChange();
    }
  };

  override render(): TemplateResult {
    const currentColor = composeOklch(this.l, this.c, this.h, this.alpha);

    return html`
      <div class="slider-grid">
        <span class="label">L</span>
        <input
          type="range"
          .value="${String(this.l)}"
          min="0"
          max="1"
          step="0.001"
          @input="${this.#onSliderInput("l")}"
        />
        <span class="value-display">${this.l.toFixed(3)}</span>

        <span class="label">C</span>
        <input
          type="range"
          .value="${String(this.c)}"
          min="0"
          max="0.4"
          step="0.001"
          @input="${this.#onSliderInput("c")}"
        />
        <span class="value-display">${this.c.toFixed(3)}</span>

        <span class="label">H</span>
        <input
          type="range"
          .value="${String(this.h)}"
          min="0"
          max="360"
          step="0.5"
          @input="${this.#onSliderInput("h")}"
        />
        <span class="value-display">${this.h.toFixed(1)}</span>

        ${this.hasAlpha
          ? html`
              <span class="label">A</span>
              <input
                type="range"
                .value="${String(this.alpha ?? 1)}"
                min="0"
                max="1"
                step="0.01"
                @input="${this.#onSliderInput("a")}"
              />
              <span class="value-display">${(this.alpha ?? 1).toFixed(2)}</span>
            `
          : nothing}
      </div>

      <div class="swatch-row">
        <div class="swatch" style="background: ${currentColor}"></div>
        <input
          class="raw-input"
          .value="${currentColor}"
          @change="${this.#onRawInput}"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "oklch-editor": OklchEditorElement;
  }
}
