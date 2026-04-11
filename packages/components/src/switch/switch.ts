import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { type FieldContext, fieldContext } from "../field/field-context.ts";

export const checkedChangeEvent = customEvent<{ checked: boolean }>(
  "checked-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout and behavioral CSS. */
const styles = css`
  :host {
    display: inline-flex;
    align-items: start;
    cursor: pointer;
    text-align: start;
  }

  :host([disabled]) {
    cursor: not-allowed;
  }

  [part="root"] {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    padding: 0;
    margin-block-end: 0;
    margin-inline: 0;
    border: none;
    cursor: pointer;
  }

  [part="thumb"] {
    position: absolute;
    left: var(--switch-thumb-offset, 0.125rem);
  }

  [part="root"][data-checked] [part="thumb"] {
    transform: translateX(var(--switch-checked-offset, 0));
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
 * `<dui-switch>` — A toggle switch for binary on/off settings.
 *
 * @csspart root - The switch track container.
 * @csspart thumb - The movable thumb indicator.
 * @fires checked-change - Fired when toggled. Detail: { checked: boolean }
 */
export class DuiSwitch extends LitElement {
  static tagName = "dui-switch" as const;

  static override styles = [base, styles];

  @property({ type: Boolean, reflect: true })
  accessor checked: boolean | undefined = undefined;

  @property({ type: Boolean, attribute: "default-checked" })
  accessor defaultChecked = false;

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({ type: Boolean, reflect: true, attribute: "read-only" })
  accessor readOnly = false;

  @property({ type: Boolean, reflect: true })
  accessor required = false;

  @property()
  accessor name: string | undefined = undefined;

  @property()
  accessor value = "on";

  @property({ attribute: "unchecked-value" })
  accessor uncheckedValue = "";

  @state()
  accessor #internalChecked = false;

  @consume({ context: fieldContext, subscribe: true })
  @state()
  accessor _fieldCtx!: FieldContext;

  get #isChecked(): boolean {
    return this.checked ?? this.#internalChecked;
  }

  get #isDisabled(): boolean {
    return this.disabled || (this._fieldCtx?.disabled ?? false);
  }

  get #isInvalid(): boolean {
    return this._fieldCtx?.invalid ?? false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.checked === undefined && this.defaultChecked) {
      this.#internalChecked = true;
    }
    this.addEventListener("click", this.#handleHostClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#handleHostClick);
  }

  #handleHostClick = (_e: Event): void => {
    this.#handleClick();
  };

  #handleClick = (): void => {
    if (this.#isDisabled || this.readOnly) return;

    const newChecked = !this.#isChecked;

    if (this.checked === undefined) {
      this.#internalChecked = newChecked;
    }

    this._fieldCtx?.markDirty();
    this._fieldCtx?.markTouched();

    this.dispatchEvent(checkedChangeEvent({ checked: newChecked }));
  };

  #handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.#handleClick();
    }
  };

  override render(): TemplateResult {
    const isChecked = this.#isChecked;
    const isDisabled = this.#isDisabled;
    const isInvalid = this.#isInvalid;
    const controlId = this._fieldCtx?.controlId ?? "";

    return html`
      <span
        part="root"
        role="switch"
        id="${controlId || nothing}"
        aria-checked="${String(isChecked)}"
        aria-disabled="${isDisabled ? "true" : nothing}"
        aria-readonly="${this.readOnly ? "true" : nothing}"
        aria-required="${this.required ? "true" : nothing}"
        aria-invalid="${isInvalid ? "true" : nothing}"
        tabindex="${isDisabled ? nothing : "0"}"
        ?data-checked="${isChecked}"
        ?data-unchecked="${!isChecked}"
        ?data-disabled="${isDisabled}"
        ?data-readonly="${this.readOnly}"
        ?data-required="${this.required}"
        ?data-invalid="${isInvalid}"
        @keydown="${this.#handleKeyDown}"
      >
        <span part="thumb"></span>
        <input
          type="checkbox"
          name="${this.name ?? nothing}"
          value="${isChecked ? this.value : this.uncheckedValue}"
          .checked="${isChecked}"
          ?disabled="${isDisabled}"
          ?required="${this.required}"
          class="HiddenInput"
          aria-hidden="true"
          tabindex="-1"
        />
      </span>
      <slot></slot>
    `;
  }
}
