/**
 * `bui-switch` (probe P3): CheckboxController with role="switch" — the
 * Phase 2 #6 question ("may SwitchController be CheckboxController with a
 * role option?") answered yes by construction.
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
    bui-switch {
      display: inline-flex;
      align-items: center;
    }

    /* Minimal probe appearance: a styled native checkbox track. */
    bui-switch > input {
      appearance: none;
      width: var(--space-8);
      height: var(--space-4_5, 1.125rem);
      margin: 0;
      border-radius: var(--radius-full, 999px);
      background: var(--border-strong, var(--border));
      position: relative;
      cursor: pointer;
      transition: background var(--duration-fast);
    }

    bui-switch > input::before {
      content: "";
      position: absolute;
      top: 2px;
      left: 2px;
      width: calc(var(--space-4_5, 1.125rem) - 4px);
      height: calc(var(--space-4_5, 1.125rem) - 4px);
      border-radius: 50%;
      background: var(--background);
      transition: translate var(--duration-fast);
    }

    bui-switch > input:checked {
      background: var(--accent);
    }

    bui-switch > input:checked::before {
      translate: calc(var(--space-8) - var(--space-4_5, 1.125rem)) 0;
    }
  }
`;

export class BuiSwitch extends ReactiveElement {
  static tagName = "bui-switch" as const;
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

  readonly switch = attach(
    this,
    new CheckboxController({
      role: "switch",
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
      field?.field.registerControl(this.switch.fieldControl) ?? null;
  }

  override disconnectedCallback(): void {
    this.#unregisterField?.();
    this.#unregisterField = null;
    super.disconnectedCallback();
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    applyProps(this, this.switch.rootProps);
    render(
      html`<input ${spread<CheckboxInputBag>(this.switch.inputProps)} />`,
      this,
    );
  }
}

export const switchFamily = [BuiSwitch] as const;
defineFamily(switchFamily);
