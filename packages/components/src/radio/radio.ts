/** Ported from original DUI: deep-future-app/app/client/components/dui/radio */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { ContextConsumer } from "@lit/context";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { radioGroupContext } from "./radio-group-context.ts";
import { type FieldContext, fieldContext } from "@dui/components/field";

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  [part="root"] {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    outline: 0;
    padding: 0;
    margin: 0;
    border: none;
  }

  [part="root"][data-disabled] {
    cursor: not-allowed;
  }

  [part="root"][data-readonly] {
    cursor: default;
  }

  [part="indicator"] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  [part="indicator"][data-unchecked] {
    display: none;
  }

  .hidden-input {
    position: absolute;
    pointer-events: none;
    opacity: 0;
    margin: 0;
    width: 0;
    height: 0;
  }
`;

/**
 * `<dui-radio>` — A radio button input.
 *
 * Must be used within a `<dui-radio-group>`. Only one radio can be
 * selected at a time within a group.
 *
 * @slot - Label content.
 * @csspart root - The radio container.
 * @csspart indicator - The selected state indicator.
 * @cssprop --radio-size - Size of the radio button.
 */
export class DuiRadio extends LitElement {
  static tagName = "dui-radio" as const;

  static override styles = [base, styles];

  /** The value attribute for this radio option. */
  @property()
  accessor value: string = "";

  /** Whether the radio is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether the radio is read-only. */
  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  #groupCtx = new ContextConsumer(this, {
    context: radioGroupContext,
    subscribe: true,
  });

  @consume({ context: fieldContext, subscribe: true })
  @state()
  accessor _fieldCtx!: FieldContext;

  get #isChecked(): boolean {
    return this.#groupCtx.value?.value === this.value;
  }

  get #isDisabled(): boolean {
    return (
      this.disabled ||
      (this.#groupCtx.value?.disabled ?? false) ||
      (this._fieldCtx?.disabled ?? false)
    );
  }

  get #isReadOnly(): boolean {
    return this.readOnly || (this.#groupCtx.value?.readOnly ?? false);
  }

  get #isRequired(): boolean {
    return this.#groupCtx.value?.required ?? false;
  }

  get #isInvalid(): boolean {
    return this._fieldCtx?.invalid ?? false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#handleHostClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#handleHostClick);
  }

  #handleHostClick = (e: Event): void => {
    if ((e.target as Element).closest("[part='root']")) return;
    this.#handleClick(e);
  };

  #handleClick = (_e: Event): void => {
    if (this.#isDisabled || this.#isReadOnly) return;

    const ctx = this.#groupCtx.value;
    if (ctx) {
      ctx.select(this.value);
      this._fieldCtx?.markDirty();
      this._fieldCtx?.markTouched();
    }
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === " ") {
      e.preventDefault();
      this.#handleClick(e);
    }
  };

  override render(): TemplateResult {
    const isChecked = this.#isChecked;
    const isDisabled = this.#isDisabled;
    const isReadOnly = this.#isReadOnly;
    const isRequired = this.#isRequired;
    const isInvalid = this.#isInvalid;
    const controlId = this._fieldCtx?.controlId ?? "";

    return html`
      <span
        part="root"
        role="radio"
        id="${controlId || nothing}"
        aria-checked="${String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${isReadOnly ? "true" : nothing}"
        aria-required="${isRequired ? "true" : nothing}"
        aria-invalid="${isInvalid ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked}"
        ?data-unchecked="${!isChecked}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${isReadOnly}"
        ?data-required="${isRequired}"
        ?data-invalid="${isInvalid}"
        @click="${this.#handleClick}"
        @keydown="${this.#handleKeyDown}"
      >
        <span
          part="indicator"
          ?data-checked="${isChecked}"
          ?data-unchecked="${!isChecked}"
        >
          ${isChecked ? html`<span part="dot"></span>` : nothing}
        </span>
        <input
          type="radio"
          name="${this.#groupCtx.value?.name ?? nothing}"
          value="${this.value}"
          .checked="${isChecked}"
          ?disabled="${isDisabled}"
          ?required="${isRequired}"
          class="hidden-input"
          aria-hidden="true"
          tabindex="-1"
        />
      </span>
      <slot></slot>
    `;
  }
}
