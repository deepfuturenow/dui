/** Ported from original DUI: deep-future-app/app/client/components/dui/slider */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";

export const valueChangeEvent = customEvent<{ value: number }>(
  "value-change",
  { bubbles: true, composed: true },
);

export const valueCommittedEvent = customEvent<{ value: number }>(
  "value-committed",
  { bubbles: true, composed: true },
);

const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    touch-action: none;
    user-select: none;
  }

  [part="root"][data-disabled] {
    pointer-events: none;
  }

  [part="track"] {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
  }

  [part="indicator"] {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: var(--slider-progress, 0%);
  }

  [part="thumb"] {
    position: absolute;
    left: var(--slider-progress, 0%);
    transform: translateX(-50%);
    cursor: grab;
    outline: none;
  }

  [part="root"][data-dragging] [part="thumb"] {
    cursor: grabbing;
  }

  /* Hidden native input for accessibility */
  .native-input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

/**
 * A slider for selecting numeric values within a range.
 *
 * Supports pointer drag, keyboard navigation (arrows, Page Up/Down, Home/End),
 * and a hidden native range input for accessibility.
 */
export class DuiSlider extends LitElement {
  static tagName = "dui-slider" as const;
  static override styles = [base, styles];

  /** Current value. */
  @property({ type: Number })
  accessor value = 0;

  /** Minimum value. */
  @property({ type: Number })
  accessor min = 0;

  /** Maximum value. */
  @property({ type: Number })
  accessor max = 100;

  /** Step increment. */
  @property({ type: Number })
  accessor step = 1;

  /** Whether the slider is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Name for form submission. */
  @property()
  accessor name = "";

  @state()
  accessor #dragging = false;

  get #progress(): number {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((this.value - this.min) / range) * 100;
  }

  #clampValue(value: number): number {
    const stepped = Math.round(value / this.step) * this.step;
    return Math.max(this.min, Math.min(this.max, stepped));
  }

  #getValueFromPosition(clientX: number): number {
    const track = this.shadowRoot?.querySelector("[part='track']");
    if (!track) return this.value;

    const rect = track.getBoundingClientRect();
    const percentage = (clientX - rect.left) / rect.width;
    const rawValue = this.min + percentage * (this.max - this.min);
    return this.#clampValue(rawValue);
  }

  #onPointerDown = (event: PointerEvent): void => {
    if (this.disabled) return;

    event.preventDefault();
    this.#dragging = true;

    const newValue = this.#getValueFromPosition(event.clientX);
    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(valueChangeEvent({ value: newValue }));
    }

    document.addEventListener("pointermove", this.#onPointerMove);
    document.addEventListener("pointerup", this.#onPointerUp);
  };

  #onPointerMove = (event: PointerEvent): void => {
    if (!this.#dragging) return;

    const newValue = this.#getValueFromPosition(event.clientX);
    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(valueChangeEvent({ value: newValue }));
    }
  };

  #onPointerUp = (): void => {
    if (!this.#dragging) return;

    this.#dragging = false;
    this.dispatchEvent(valueCommittedEvent({ value: this.value }));

    document.removeEventListener("pointermove", this.#onPointerMove);
    document.removeEventListener("pointerup", this.#onPointerUp);
  };

  #onKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    let newValue = this.value;
    const largeStep = this.step * 10;

    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        event.preventDefault();
        newValue = this.#clampValue(this.value + this.step);
        break;
      case "ArrowLeft":
      case "ArrowDown":
        event.preventDefault();
        newValue = this.#clampValue(this.value - this.step);
        break;
      case "PageUp":
        event.preventDefault();
        newValue = this.#clampValue(this.value + largeStep);
        break;
      case "PageDown":
        event.preventDefault();
        newValue = this.#clampValue(this.value - largeStep);
        break;
      case "Home":
        event.preventDefault();
        newValue = this.min;
        break;
      case "End":
        event.preventDefault();
        newValue = this.max;
        break;
      default:
        return;
    }

    if (newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(valueChangeEvent({ value: newValue }));
      this.dispatchEvent(valueCommittedEvent({ value: newValue }));
    }
  };

  #onNativeInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const newValue = parseFloat(target.value);
    if (!isNaN(newValue) && newValue !== this.value) {
      this.value = newValue;
      this.dispatchEvent(valueChangeEvent({ value: newValue }));
    }
  };

  #onNativeChange = (): void => {
    this.dispatchEvent(valueCommittedEvent({ value: this.value }));
  };

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener("pointermove", this.#onPointerMove);
    document.removeEventListener("pointerup", this.#onPointerUp);
  }

  override render(): TemplateResult {
    return html`
      <div
        part="root"
        role="group"
        ?data-disabled=${this.disabled}
        ?data-dragging=${this.#dragging}
        style="--slider-progress: ${this.#progress}%"
        @pointerdown=${this.#onPointerDown}
      >
        <div part="track">
          <div part="indicator"></div>
        </div>
        <div
          part="thumb"
          tabindex=${this.disabled ? -1 : 0}
          @keydown=${this.#onKeyDown}
        ></div>
        <input
          class="native-input"
          type="range"
          name=${this.name}
          .value=${String(this.value)}
          min=${this.min}
          max=${this.max}
          step=${this.step}
          ?disabled=${this.disabled}
          aria-valuenow=${this.value}
          aria-valuemin=${this.min}
          aria-valuemax=${this.max}
          @input=${this.#onNativeInput}
          @change=${this.#onNativeChange}
        />
      </div>
    `;
  }
}
