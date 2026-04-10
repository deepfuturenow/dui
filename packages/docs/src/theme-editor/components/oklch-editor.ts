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

      dui-slider {
        --slider-track-height: var(--space-1);
        --slider-thumb-size: var(--space-3_5);
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

      .swatch-row dui-input {
        flex: 1;
        min-width: 0;
        font-size: var(--font-size-xs);
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
    (e: CustomEvent<{ value: number }>): void => {
      const val = e.detail.value;
      if (channel === "l") this.l = val;
      else if (channel === "c") this.c = val;
      else if (channel === "h") this.h = val;
      else this.alpha = val;
      this.#emitChange();
    };

  #onRawInput = (e: CustomEvent<{ value: string }>): void => {
    const parsed = parseOklch(e.detail.value);
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
        <dui-slider
          .value=${this.l}
          .min=${0}
          .max=${1}
          .step=${0.001}
          @value-change=${this.#onSliderInput("l")}
        ></dui-slider>
        <span class="value-display">${this.l.toFixed(3)}</span>

        <span class="label">C</span>
        <dui-slider
          .value=${this.c}
          .min=${0}
          .max=${0.4}
          .step=${0.001}
          @value-change=${this.#onSliderInput("c")}
        ></dui-slider>
        <span class="value-display">${this.c.toFixed(3)}</span>

        <span class="label">H</span>
        <dui-slider
          .value=${this.h}
          .min=${0}
          .max=${360}
          .step=${0.5}
          @value-change=${this.#onSliderInput("h")}
        ></dui-slider>
        <span class="value-display">${this.h.toFixed(1)}</span>

        ${this.hasAlpha
          ? html`
              <span class="label">A</span>
              <dui-slider
                .value=${this.alpha ?? 1}
                .min=${0}
                .max=${1}
                .step=${0.01}
                @value-change=${this.#onSliderInput("a")}
              ></dui-slider>
              <span class="value-display">${(this.alpha ?? 1).toFixed(2)}</span>
            `
          : nothing}
      </div>

      <div class="swatch-row">
        <div class="swatch" style="background: ${currentColor}"></div>
        <dui-input
          .value="${currentColor}"
          @input-change="${this.#onRawInput}"
        ></dui-input>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "oklch-editor": OklchEditorElement;
  }
}
