/** Ported from original DUI: deep-future-app/app/client/components/dui/select */

import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { consume } from "@lit/context";
import { base } from "@dui/core/base";
import { customEvent } from "@dui/core/event";
import { FloatingPortalController } from "@dui/core/floating-portal-controller";
import { type FieldContext, fieldContext } from "../field/field-context.ts";


export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

export type SelectValueChangeDetail = {
  value: string;
  option: SelectOption;
};

export const valueChangeEvent = customEvent<SelectValueChangeDetail>(
  "value-change",
  { bubbles: true, composed: true },
);

/** Structural styles only — layout CSS. */
const hostStyles = css`
  :host {
    display: block;
  }
`;

const componentStyles = css`
  .Trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
  }

  .Trigger[data-disabled] {
    cursor: not-allowed;
  }

  .Value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Icon {
    flex-shrink: 0;
  }
`;

/** Structural styles injected into the portal positioner. */
const portalPopupStyles = [
  css`
    .Popup {
      max-height: 240px;
      overflow-y: auto;
      overscroll-behavior: contain;
      opacity: 1;
      transform: translateY(0);
      transition-property: opacity, transform;
      pointer-events: auto;
    }

    .Popup[data-starting-style],
    .Popup[data-ending-style] {
      opacity: 0;
    }

    .Item {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .Item[data-disabled] {
      cursor: not-allowed;
    }

    .ItemIndicator {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ItemText {
      flex: 1;
    }
  `,
];

/**
 * `<dui-select>` — A dropdown select for choosing from a list of options.
 *
 * @csspart trigger - The trigger button.
 * @csspart value - The displayed value text.
 * @fires value-change - Fired when the selected value changes.
 *   Detail: { value: string, option: SelectOption }
 */
export class DuiSelect extends LitElement {
  static tagName = "dui-select" as const;
  static override styles = [base, hostStyles, componentStyles];

  /** The available options. */
  @property({ attribute: false })
  accessor options: SelectOption[] = [];

  /** Currently selected value. */
  @property({ type: String })
  accessor value = "";

  /** Placeholder text shown when no value is selected. */
  @property({ type: String })
  accessor placeholder = "Select...";

  /** Whether the select is disabled. */
  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  /** Name for form submission. */
  @property({ type: String })
  accessor name = "";

  @consume({ context: fieldContext, subscribe: true })
  @state()
  accessor _fieldCtx!: FieldContext;

  @state()
  accessor #highlightedIndex = -1;

  #triggerId = `select-trigger-${crypto.randomUUID().slice(0, 8)}`;
  #listboxId = `select-listbox-${crypto.randomUUID().slice(0, 8)}`;

  #popup = new FloatingPortalController(this, {
    getAnchor: () =>
      this.shadowRoot?.querySelector<HTMLElement>(".Trigger"),
    styles: portalPopupStyles,
    onOpen: () => {
      this.#highlightedIndex = this.#selectedIndex;
    },
    onClose: () => {
      this.#highlightedIndex = -1;
      this._fieldCtx?.markTouched();
    },
    renderPopup: (portal) => {
      return html`
        <div
          class="Popup"
          ?data-starting-style="${portal.isStarting}"
          ?data-ending-style="${portal.isEnding}"
        >
          <div
            class="Listbox"
            id="${this.#listboxId}"
            role="listbox"
            aria-labelledby="${this._fieldCtx?.labelId ?? ""}"
            @mousedown="${this.#onListMouseDown}"
          >
            ${repeat(
              this.options,
              (option) => option.value,
              this.#renderItem,
            )}
          </div>
        </div>
      `;
    },
  });

  // ---- Computed ----

  get #isDisabled(): boolean {
    return this.disabled || (this._fieldCtx?.disabled ?? false);
  }

  get #isInvalid(): boolean {
    return this._fieldCtx?.invalid ?? false;
  }

  get #selectedOption(): SelectOption | undefined {
    return this.options.find((o) => o.value === this.value);
  }

  get #selectedIndex(): number {
    return this.options.findIndex((o) => o.value === this.value);
  }

  get #displayValue(): string {
    return this.#selectedOption?.label ?? "";
  }

  // ---- Event handlers ----

  #onTriggerClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.#isDisabled) return;

    if (this.#popup.isOpen) {
      this.#popup.close();
    } else {
      this.#popup.open();
    }
  };

  #onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (this.#isDisabled) return;

    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        if (this.#popup.isOpen) {
          const option = this.options[this.#highlightedIndex];
          if (option && !option.disabled) {
            this.#selectOption(option);
          }
        } else {
          this.#popup.open();
        }
        break;
      }

      case "ArrowDown": {
        event.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          this.#highlightedIndex = this.#nextEnabledIndex(
            this.#highlightedIndex,
            1,
          );
        }
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        if (!this.#popup.isOpen) {
          this.#popup.open();
        } else {
          this.#highlightedIndex = this.#nextEnabledIndex(
            this.#highlightedIndex,
            -1,
          );
        }
        break;
      }

      case "Home": {
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#highlightedIndex = this.#nextEnabledIndex(-1, 1);
        }
        break;
      }

      case "End": {
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#highlightedIndex = this.#nextEnabledIndex(
            this.options.length,
            -1,
          );
        }
        break;
      }

      case "Escape": {
        if (this.#popup.isOpen) {
          event.preventDefault();
          this.#popup.close();
          this.#focusTrigger();
        }
        break;
      }

      case "Tab": {
        if (this.#popup.isOpen) {
          this.#popup.close();
        }
        break;
      }
    }
  };

  #onListMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  #onItemClick = (option: SelectOption): void => {
    if (option.disabled) return;
    this.#selectOption(option);
  };

  #onItemMouseEnter = (index: number): void => {
    if (!this.options[index]?.disabled) {
      this.#highlightedIndex = index;
    }
  };

  // ---- Selection ----

  #selectOption(option: SelectOption): void {
    this.value = option.value;
    this._fieldCtx?.markDirty();
    this._fieldCtx?.setFilled(this.value.length > 0);
    this.dispatchEvent(valueChangeEvent({ value: option.value, option }));
    this.#popup.close();
    this.#focusTrigger();
  }

  #nextEnabledIndex(current: number, direction: 1 | -1): number {
    const len = this.options.length;
    let next = current + direction;
    while (next >= 0 && next < len) {
      if (!this.options[next].disabled) return next;
      next += direction;
    }
    return current;
  }

  #focusTrigger(): void {
    const trigger =
      this.shadowRoot?.querySelector<HTMLElement>(".Trigger");
    trigger?.focus();
  }

  // ---- Render ----

  #renderItem = (option: SelectOption, index: number): TemplateResult => {
    const isSelected = option.value === this.value;
    const isHighlighted = index === this.#highlightedIndex;

    return html`
      <div
        class="Item"
        role="option"
        id="${this.#listboxId}-option-${index}"
        aria-selected="${isSelected}"
        ?data-selected="${isSelected}"
        ?data-highlighted="${isHighlighted}"
        ?data-disabled="${option.disabled}"
        @click="${() => this.#onItemClick(option)}"
        @mouseenter="${() => this.#onItemMouseEnter(index)}"
      >
        <span class="ItemIndicator">
          ${isSelected
            ? html`<dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>`
            : nothing}
        </span>
        <span class="ItemText">${option.label}</span>
      </div>
    `;
  };

  override render(): TemplateResult {
    const hasValue = this.value !== "" && this.#selectedOption != null;

    return html`
      <div
        class="Trigger"
        part="trigger"
        id="${this.#triggerId}"
        role="combobox"
        tabindex="${this.#isDisabled ? -1 : 0}"
        aria-haspopup="listbox"
        aria-expanded="${this.#popup.isOpen}"
        aria-controls="${this.#listboxId}"
        aria-activedescendant="${this.#highlightedIndex >= 0
          ? `${this.#listboxId}-option-${this.#highlightedIndex}`
          : nothing}"
        aria-labelledby="${this._fieldCtx?.labelId ?? ""}"
        aria-invalid="${this.#isInvalid}"
        ?data-disabled="${this.#isDisabled}"
        ?data-invalid="${this.#isInvalid}"
        ?data-open="${this.#popup.isOpen}"
        @click="${this.#onTriggerClick}"
        @keydown="${this.#onTriggerKeyDown}"
        @focus="${() => this._fieldCtx?.setFocused(true)}"
        @blur="${() => this._fieldCtx?.setFocused(false)}"
      >
        <span
          class="Value"
          part="value"
          ?data-placeholder="${!hasValue}"
        >
          ${hasValue ? this.#displayValue : this.placeholder}
        </span>
        <span class="Icon">
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></dui-icon>
        </span>
      </div>

      ${this.name
        ? html`<input type="hidden" name="${this.name}" .value="${this.value}" />`
        : nothing}
    `;
  }
}
