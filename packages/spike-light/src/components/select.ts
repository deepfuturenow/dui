/**
 * `bui-select` family (probe P4) — compound, light DOM, options as elements.
 *
 * bui:source @dui/components/select@2.4.0  bui:hash <recorded at copy>
 *
 *   <bui-select value="apple">
 *     <bui-select-trigger></bui-select-trigger>
 *     <bui-select-popup>
 *       <bui-select-option value="apple">Apple</bui-select-option>
 *       ...
 *     </bui-select-popup>
 *   </bui-select>
 *
 * The popup element IS the listbox and IS the scroller: a plain element with
 * overflow auto, no scroll-area dependency. The option check-mark is a CSS
 * ::before mask, because an option's label is its consumer-authored children
 * and rendered chrome would land after them.
 */
import { css, ReactiveElement, unsafeCSS } from "@lit/reactive-element";
import { html, render } from "lit-html";
import {
  SelectController,
  type SelectOptionBag,
  type SelectTriggerBag,
  type SelectValueBag,
} from "../controllers/select.ts";
import { applyProps, spread } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";

const CHECK_MASK =
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E")`;

const styles = css`
  @layer bui.components {
    bui-select {
      display: block;
      min-width: 0;
      --select-icon-size: var(--space-4);
      --select-item-font-size: var(--text-sm);
      --select-item-padding-y: var(--space-1_5);
      --select-item-icon-size: var(--space-3_5);
    }

    bui-select-trigger {
      display: block;
    }

    bui-select-trigger > button {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      cursor: pointer;
      user-select: none;
      height: var(--component-height-md);
      gap: var(--space-2);
      padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-1);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      text-align: left;
      transition-property: background, border-color, box-shadow;
      transition-duration: var(--duration-fast);
    }

    bui-select-trigger > button:hover:not([data-disabled]) {
      background: oklch(from var(--foreground) l c h / 0.05);
    }

    bui-select-trigger > button:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
        var(--focus-ring-color);
    }

    bui-select-trigger > button[data-disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    bui-select-trigger .value {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    bui-select-trigger .value[data-placeholder] {
      color: var(--text-3);
    }

    bui-select-trigger .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      color: var(--text-1);
    }

    bui-select-trigger .icon svg {
      width: var(--select-icon-size);
      height: var(--select-icon-size);
    }

    /* ── Popup: listbox and scroller in one element ── */

    bui-select-popup {
      position: fixed;
      inset: auto;
      margin: 0;
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface-2);
      box-shadow: var(--shadow-md);
      padding: var(--space-1);
      max-height: var(--dui-available-height, 240px);
      overflow-y: auto;
      overscroll-behavior: contain;
      opacity: 0;
      transition-property: opacity, transform, overlay, display;
      transition-behavior: allow-discrete;
      transition-duration: var(--duration-fast);
    }

    bui-select-popup:popover-open {
      opacity: 1;
    }

    @starting-style {
      bui-select-popup:popover-open {
        opacity: 0;
      }
    }

    /* ── Options ── */

    bui-select-option {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: var(--space-2);
      padding: var(--select-item-padding-y) var(--space-2);
      border-radius: var(--radius-sm);
      font-family: var(--font-sans);
      font-size: var(--select-item-font-size);
      line-height: var(--line-height-snug);
      color: var(--text-1);
      white-space: nowrap;
      user-select: none;
    }

    bui-select-option::before {
      content: "";
      flex-shrink: 0;
      width: var(--select-item-icon-size);
      height: var(--select-item-icon-size);
      background-color: currentColor;
      mask-image: none;
      mask-size: contain;
      mask-repeat: no-repeat;
      mask-position: center;
    }

    bui-select-option[data-selected]::before {
      mask-image: ${unsafeCSS(CHECK_MASK)};
    }

    bui-select-option[data-highlighted] {
      background: oklch(from var(--foreground) l c h / 0.08);
    }

    bui-select-option[data-disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
`;

// ---- Root -------------------------------------------------------------------

export class BuiSelect extends ReactiveElement {
  static tagName = "bui-select" as const;
  static override styles = styles;

  static override properties = {
    value: { type: String },
    placeholder: { type: String },
    disabled: { type: Boolean, reflect: true },
    alignItemToTrigger: { type: Boolean, attribute: "align-item-to-trigger" },
  };

  declare value: string;
  declare placeholder: string;
  declare disabled: boolean;
  declare alignItemToTrigger: boolean;

  readonly select = attach(
    this,
    new SelectController({
      getValue: () => this.value,
      getPlaceholder: () => this.placeholder,
      getDisabled: () => this.disabled,
      getAlignItemToTrigger: () => this.alignItemToTrigger,
      onChange: (value) => {
        this.value = value;
        this.dispatchEvent(
          new CustomEvent("value-change", {
            detail: { value },
            bubbles: true,
            composed: true,
          }),
        );
      },
    }),
  );

  constructor() {
    super();
    this.value = "";
    this.placeholder = "Select...";
    this.disabled = false;
    this.alignItemToTrigger = true;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }
}

// ---- Parts ------------------------------------------------------------------

abstract class SelectPart extends ReactiveElement {
  protected root: BuiSelect | null = null;
  #unregister: (() => void) | null = null;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root = this.closest<BuiSelect>("bui-select");
    if (!this.root) {
      console.warn(
        `[bui] <${this.tagName.toLowerCase()}> outside <bui-select>`,
      );
      return;
    }
    this.#unregister = this.root.select.registerAux({
      element: this,
      requestUpdate: () => this.requestUpdate(),
    });
  }

  override disconnectedCallback(): void {
    this.#unregister?.();
    this.#unregister = null;
    super.disconnectedCallback();
  }
}

/** Renders the trigger button: value display + chevron. */
export class BuiSelectTrigger extends SelectPart {
  static tagName = "bui-select-trigger" as const;

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (!this.root) return;
    const c = this.root.select;
    render(
      html`
        <button ${spread<SelectTriggerBag>(c.triggerProps)}>
          <span class="value" ${spread<SelectValueBag>(c.valueProps)}>${c
            .displayValue}</span>
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
      `,
      this,
    );
  }
}

/** Pure container: the popover, the listbox, and the scroller. */
export class BuiSelectPopup extends SelectPart {
  static tagName = "bui-select-popup" as const;

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.select.popupProps);
  }
}

/** An option: registers itself; its children are its label. */
export class BuiSelectOption extends ReactiveElement {
  static tagName = "bui-select-option" as const;

  static override properties = {
    value: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare value: string;
  declare disabled: boolean;

  #root: BuiSelect | null = null;
  #unregister: (() => void) | null = null;

  constructor() {
    super();
    this.value = "";
    this.disabled = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#root = this.closest<BuiSelect>("bui-select");
    if (!this.#root) {
      console.warn("[bui] <bui-select-option> outside <bui-select>");
      return;
    }
    this.#unregister = this.#root.select.register(
      { element: this, requestUpdate: () => this.requestUpdate() },
      {
        getValue: () => this.value,
        getLabel: () => this.textContent?.trim() ?? "",
        getDisabled: () => this.disabled,
      },
    );
  }

  override disconnectedCallback(): void {
    this.#unregister?.();
    this.#unregister = null;
    super.disconnectedCallback();
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (!this.#root) return;
    applyProps(
      this,
      this.#root.select.optionProps({
        element: this,
        requestUpdate: () => this.requestUpdate(),
      }) as SelectOptionBag,
    );
  }
}

export const selectFamily = [
  BuiSelect,
  BuiSelectTrigger,
  BuiSelectPopup,
  BuiSelectOption,
] as const;

defineFamily(selectFamily);
