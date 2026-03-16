/** Ported from original DUI: deep-future-app/app/client/components/dui/input */

import { css, html, LitElement, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";
import { base } from "@dui/core/base";
import { type FieldContext, fieldContext } from "@dui/components/field";
import { customEvent } from "@dui/core/event";

export const inputChangeEvent = customEvent<{ value: string }>("input-change", {
  bubbles: true,
  composed: true,
});

/** Structural styles only — layout CSS. */
const styles = css`
  :host {
    display: block;
  }

  [part="input"] {
    box-sizing: border-box;
    width: 100%;
    outline: none;
    transition-property: border-color, box-shadow;
  }

  [part="input"]:disabled {
    cursor: not-allowed;
  }
`;

/**
 * `<dui-input>` — A native input element that integrates with dui-field.
 *
 * Automatically works with Field for accessible labeling and validation.
 *
 * @csspart input - The native input element.
 * @fires input-change - Fired when value changes. Detail: { value: string }
 */
export class DuiInput extends LitElement {
  static tagName = "dui-input" as const;

  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static override styles = [base, styles];

  /** Input type (text, email, password, etc.) */
  @property({ type: String })
  accessor type: string = "text";

  /** Current input value. */
  @property({ type: String })
  accessor value = "";

  /** Placeholder text. */
  @property({ type: String })
  accessor placeholder = "";

  /** Whether the input is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Whether the input is required. */
  @property({ type: Boolean })
  accessor required = false;

  /** Whether the input is read-only. */
  @property({ type: Boolean })
  accessor readonly = false;

  /** Minimum length for text inputs. */
  @property({ type: Number, attribute: "minlength" })
  accessor minLength: number | undefined = undefined;

  /** Maximum length for text inputs. */
  @property({ type: Number, attribute: "maxlength" })
  accessor maxLength: number | undefined = undefined;

  /** Pattern for validation. */
  @property({ type: String })
  accessor pattern: string | undefined = undefined;

  /** Name attribute for form submission. */
  @property({ type: String })
  accessor name = "";

  /** Autocomplete hint for the browser. */
  @property({ type: String })
  accessor autocomplete: string | undefined = undefined;

  /** Whether the input should receive focus on mount. */
  @property({ type: Boolean })
  override accessor autofocus = false;

  @consume({ context: fieldContext, subscribe: true })
  @state()
  accessor #ctx!: FieldContext;

  get #controlId(): string {
    return this.#ctx?.controlId ?? "";
  }

  get #descriptionId(): string | undefined {
    return this.#ctx?.descriptionId;
  }

  get #errorId(): string | undefined {
    return this.#ctx?.errorId;
  }

  get #isDisabled(): boolean {
    return this.disabled || (this.#ctx?.disabled ?? false);
  }

  get #isInvalid(): boolean {
    return this.#ctx?.invalid ?? false;
  }

  override firstUpdated(): void {
    if (this.autofocus) {
      this.focus();
    }
  }

  #onInput = (event: InputEvent): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    this.#ctx?.markDirty();
    this.#ctx?.setFilled(this.value.length > 0);

    this.dispatchEvent(inputChangeEvent({ value: this.value }));
  };

  #onFocus = (): void => {
    this.#ctx?.setFocused(true);
  };

  #onBlur = (): void => {
    this.#ctx?.setFocused(false);
    this.#ctx?.markTouched();
  };

  override render(): TemplateResult {
    const describedBy =
      [this.#descriptionId, this.#isInvalid ? this.#errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return html`
      <input
        part="input"
        id="${this.#controlId}"
        type="${this.type}"
        .value="${live(this.value)}"
        placeholder="${this.placeholder}"
        ?disabled="${this.#isDisabled}"
        ?required="${this.required}"
        ?readonly="${this.readonly}"
        minlength="${ifDefined(this.minLength)}"
        maxlength="${ifDefined(this.maxLength)}"
        pattern="${ifDefined(this.pattern)}"
        name="${this.name}"
        autocomplete="${ifDefined(this.autocomplete)}"
        aria-describedby="${ifDefined(describedBy)}"
        aria-invalid="${this.#isInvalid}"
        ?data-disabled="${this.#isDisabled}"
        ?data-invalid="${this.#isInvalid}"
        ?data-valid="${!this.#isInvalid}"
        ?data-dirty="${this.#ctx?.dirty}"
        ?data-touched="${this.#ctx?.touched}"
        ?data-filled="${this.#ctx?.filled}"
        ?data-focused="${this.#ctx?.focused}"
        @input="${this.#onInput}"
        @focus="${this.#onFocus}"
        @blur="${this.#onBlur}"
      />
    `;
  }
}
