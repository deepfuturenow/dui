/**
 * `bui-checkbox` (probe P3): form-associated host + real nameless <input>.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import { html, render } from "lit-html";
import {
  CheckboxController,
  type CheckboxInputBag,
} from "../controllers/checkbox.ts";
import type { BuiField } from "./field.ts";
import { applyProps, spread } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";
import "./field.ts";

const styles = css`
  @layer bui.components {
    bui-checkbox {
      display: inline-flex;
      align-items: center;
    }

    bui-checkbox > input {
      appearance: auto;
      width: var(--space-4);
      height: var(--space-4);
      margin: 0;
      accent-color: var(--accent);
      cursor: pointer;
    }

    bui-checkbox > input:disabled {
      cursor: not-allowed;
    }
  }
`;

export class BuiCheckbox extends ReactiveElement {
  static tagName = "bui-checkbox" as const;
  static override styles = styles;
  static formAssociated = true;

  static override properties = {
    checked: { type: Boolean, reflect: true },
    value: { type: String },
    name: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
  };
  declare checked: boolean;
  declare value: string;
  declare name: string;
  declare required: boolean;
  declare disabled: boolean;

  #internals: ElementInternals = this.attachInternals();
  #unregisterField: (() => void) | null = null;

  readonly checkbox = attach(
    this,
    new CheckboxController({
      getChecked: () => this.checked,
      getValue: () => this.value,
      getRequired: () => this.required,
      getDisabled: () => this.disabled,
      getInternals: () => this.#internals,
      onChange: (checked) => {
        this.checked = checked;
        this.dispatchEvent(
          new CustomEvent("checked-change", {
            detail: { checked },
            bubbles: true,
            composed: true,
          }),
        );
      },
    }),
  );

  constructor() {
    super();
    this.checked = false;
    this.value = "on";
    this.name = "";
    this.required = false;
    this.disabled = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    const field = this.closest<BuiField>("bui-field");
    this.#unregisterField =
      field?.field.registerControl(this.checkbox.fieldControl) ?? null;
  }

  override disconnectedCallback(): void {
    this.#unregisterField?.();
    this.#unregisterField = null;
    super.disconnectedCallback();
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    applyProps(this, this.checkbox.rootProps);
    render(
      html`<input ${spread<CheckboxInputBag>(this.checkbox.inputProps)} />`,
      this,
    );
  }
}

export const checkboxFamily = [BuiCheckbox] as const;
defineFamily(checkboxFamily);
