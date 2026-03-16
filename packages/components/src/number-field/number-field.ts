import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { live } from "lit/directives/live.js";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { type FieldContext, fieldContext } from "@dui/components/field";

export const valueChangeEvent = customEvent<{ value: number }>(
  "value-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="root"] {
    display: inline-flex;
    align-items: center;
  }

  [part="input"] {
    box-sizing: border-box;
    outline: none;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    text-align: center;
    min-width: 0;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }

  [part="decrement"],
  [part="increment"] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font: inherit;
    color: inherit;
    flex-shrink: 0;
  }

  [part="decrement"]:disabled,
  [part="increment"]:disabled {
    cursor: not-allowed;
  }

  .HiddenInput {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    margin: 0;
    width: 0;
    height: 0;
  }
`;

/**
 * `<dui-number-field>` — A numeric input with increment/decrement buttons.
 *
 * @csspart root - The outer container.
 * @csspart input - The text input element.
 * @csspart decrement - The decrement button.
 * @csspart increment - The increment button.
 * @fires value-change - Fired when value changes. Detail: { value: number }
 */
export class DuiNumberField extends LitElement {
  static tagName = "dui-number-field" as const;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  @property({ type: Number })
  accessor value: number | undefined = undefined;

  @property({ type: Number, attribute: "default-value" })
  accessor defaultValue: number | undefined = undefined;

  @property({ type: Number })
  accessor min: number | undefined = undefined;

  @property({ type: Number })
  accessor max: number | undefined = undefined;

  @property({ type: Number })
  accessor step = 1;

  @property({ type: Number, attribute: "large-step" })
  accessor largeStep = 10;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  @property({ type: Boolean })
  accessor required = false;

  @property()
  accessor name: string | undefined = undefined;

  @state()
  accessor #internalValue: number | undefined = undefined;

  @state()
  accessor #inputText = "";

  @consume({ context: fieldContext, subscribe: true })
  @state()
  accessor #fieldCtx!: FieldContext;

  get #currentValue(): number | undefined {
    return this.value ?? this.#internalValue;
  }

  get #isDisabled(): boolean {
    return this.disabled || (this.#fieldCtx?.disabled ?? false);
  }

  get #isInvalid(): boolean {
    return this.#fieldCtx?.invalid ?? false;
  }

  get #canDecrement(): boolean {
    const v = this.#currentValue;
    if (v === undefined) return true;
    return this.min === undefined || v > this.min;
  }

  get #canIncrement(): boolean {
    const v = this.#currentValue;
    if (v === undefined) return true;
    return this.max === undefined || v < this.max;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === undefined && this.defaultValue !== undefined) {
      this.#internalValue = this.#clamp(this.defaultValue);
    }
    this.#syncInputText();
  }

  override willUpdate(): void {
    this.#syncInputText();
  }

  #syncInputText(): void {
    const v = this.#currentValue;
    this.#inputText = v !== undefined ? String(v) : "";
  }

  #clamp(val: number): number {
    if (this.min !== undefined) val = Math.max(this.min, val);
    if (this.max !== undefined) val = Math.min(this.max, val);
    return val;
  }

  #setValue(val: number): void {
    const clamped = this.#clamp(val);

    if (this.value === undefined) {
      this.#internalValue = clamped;
    }

    this.#fieldCtx?.markDirty();
    this.#fieldCtx?.setFilled(true);

    this.dispatchEvent(valueChangeEvent({ value: clamped }));
  }

  #increment = (amount: number): void => {
    if (this.#isDisabled || this.readOnly) return;
    const current = this.#currentValue ?? this.min ?? 0;
    this.#setValue(current + amount);
  };

  #decrement = (amount: number): void => {
    if (this.#isDisabled || this.readOnly) return;
    const current = this.#currentValue ?? this.max ?? 0;
    this.#setValue(current - amount);
  };

  #commitInput(): void {
    const parsed = parseFloat(this.#inputText);
    if (Number.isNaN(parsed)) {
      this.#syncInputText();
    } else {
      this.#setValue(parsed);
    }
  }

  #onInput = (e: InputEvent): void => {
    this.#inputText = (e.target as HTMLInputElement).value;
  };

  #onBlur = (): void => {
    this.#commitInput();
    this.#fieldCtx?.setFocused(false);
    this.#fieldCtx?.markTouched();
  };

  #onFocus = (): void => {
    this.#fieldCtx?.setFocused(true);
  };

  #onKeyDown = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        this.#increment(e.shiftKey ? this.largeStep : this.step);
        break;
      case "ArrowDown":
        e.preventDefault();
        this.#decrement(e.shiftKey ? this.largeStep : this.step);
        break;
      case "Home":
        if (this.min !== undefined) {
          e.preventDefault();
          this.#setValue(this.min);
        }
        break;
      case "End":
        if (this.max !== undefined) {
          e.preventDefault();
          this.#setValue(this.max);
        }
        break;
      case "Enter":
        this.#commitInput();
        break;
    }
  };

  #onDecrementClick = (): void => {
    this.#decrement(this.step);
  };

  #onIncrementClick = (): void => {
    this.#increment(this.step);
  };

  override render(): TemplateResult {
    const isDisabled = this.#isDisabled;
    const isInvalid = this.#isInvalid;
    const controlId = this.#fieldCtx?.controlId ?? "";
    const currentValue = this.#currentValue;

    return html`
      <div
        part="root"
        ?data-disabled="${isDisabled}"
        ?data-invalid="${isInvalid}"
      >
        <button
          part="decrement"
          type="button"
          tabindex="-1"
          aria-label="Decrease"
          ?disabled="${isDisabled || this.readOnly || !this.#canDecrement}"
          @click="${this.#onDecrementClick}"
        >
          <slot name="decrement">&minus;</slot>
        </button>
        <input
          part="input"
          id="${controlId || nothing}"
          type="text"
          inputmode="decimal"
          .value="${live(this.#inputText)}"
          ?disabled="${isDisabled}"
          ?readonly="${this.readOnly}"
          ?required="${this.required}"
          aria-invalid="${isInvalid ? "true" : nothing}"
          ?data-disabled="${isDisabled}"
          @input="${this.#onInput}"
          @keydown="${this.#onKeyDown}"
          @focus="${this.#onFocus}"
          @blur="${this.#onBlur}"
        />
        <button
          part="increment"
          type="button"
          tabindex="-1"
          aria-label="Increase"
          ?disabled="${isDisabled || this.readOnly || !this.#canIncrement}"
          @click="${this.#onIncrementClick}"
        >
          <slot name="increment">+</slot>
        </button>
        ${this.name
          ? html`<input
              type="hidden"
              name="${this.name}"
              .value="${String(currentValue ?? "")}"
            />`
          : nothing}
      </div>
    `;
  }
}
