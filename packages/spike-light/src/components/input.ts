/**
 * `bui-input` (probe P3): form-associated host + real nameless <input>.
 * Light DOM means no event retargeting and no delegatesFocus — the consumer
 * focuses and reads the actual input.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import { html, render } from "lit-html";
import { InputController, type InputInputBag } from "../controllers/input.ts";
import type { BuiField } from "./field.ts";
import { spread } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";
import "./field.ts";

const styles = css`
  @layer bui.components {
    bui-input {
      display: block;
    }

    bui-input > input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      height: var(--component-height-md);
      padding: 0 var(--space-2_5);
      border: var(--border-width-thin) solid var(--border);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--text-1);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
    }

    bui-input > input::placeholder {
      color: var(--text-3);
    }

    bui-input > input:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    }

    bui-input > input[aria-invalid="true"] {
      border-color: var(--destructive);
    }
  }
`;

export class BuiInput extends ReactiveElement {
  static tagName = "bui-input" as const;
  static override styles = styles;
  static formAssociated = true;

  static override properties = {
    value: { type: String },
    name: { type: String },
    placeholder: { type: String },
    type: { type: String },
    required: { type: Boolean },
    disabled: { type: Boolean, reflect: true },
  };
  declare value: string;
  declare name: string;
  declare placeholder: string;
  declare type: string;
  declare required: boolean;
  declare disabled: boolean;

  #internals: ElementInternals = this.attachInternals();
  #unregisterField: (() => void) | null = null;

  readonly input = attach(
    this,
    new InputController({
      getValue: () => this.value,
      getPlaceholder: () => this.placeholder,
      getRequired: () => this.required,
      getDisabled: () => this.disabled,
      getType: () => this.type,
      getInternals: () => this.#internals,
      onInput: (value) => {
        this.value = value;
      },
    }),
  );

  constructor() {
    super();
    this.value = "";
    this.name = "";
    this.placeholder = "";
    this.type = "text";
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
      field?.field.registerControl(this.input.fieldControl) ?? null;
  }

  override disconnectedCallback(): void {
    this.#unregisterField?.();
    this.#unregisterField = null;
    super.disconnectedCallback();
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    render(
      html`<input ${spread<InputInputBag>(this.input.inputProps)} />`,
      this,
    );
  }
}

export const inputFamily = [BuiInput] as const;
defineFamily(inputFamily);
