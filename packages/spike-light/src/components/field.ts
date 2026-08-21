/**
 * `bui-field` family (probe P3): root + label/description/error parts.
 * Controls register through `closest("bui-field")` — no tag list.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import { FieldController } from "../controllers/field.ts";
import { applyProps } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";

const styles = css`
  @layer bui.components {
    bui-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-1_5);
      font-family: var(--font-sans);
    }

    bui-field-label {
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      font-weight: var(--font-weight-medium);
      color: var(--text-1);
      cursor: default;
    }

    bui-field-label[data-disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    bui-field-description {
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
      color: var(--text-2);
    }

    bui-field-error {
      display: none;
      font-size: var(--text-xs);
      line-height: var(--text-xs--line-height);
      color: var(--destructive);
    }

    bui-field-error[data-invalid] {
      display: block;
    }
  }
`;

export class BuiField extends ReactiveElement {
  static tagName = "bui-field" as const;
  static override styles = styles;
  static override properties = {
    disabled: { type: Boolean, reflect: true },
    invalid: { type: Boolean, reflect: true },
  };
  declare disabled: boolean;
  declare invalid: boolean;

  readonly field = attach(
    this,
    new FieldController({
      getDisabled: () => this.disabled,
      getInvalid: () => this.invalid,
    }),
  );

  constructor() {
    super();
    this.disabled = false;
    this.invalid = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    applyProps(this, this.field.rootProps);
  }
}

abstract class FieldPart extends ReactiveElement {
  protected root: BuiField | null = null;
  protected unregister: (() => void) | null = null;
  #unregisterAux: (() => void) | null = null;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root = this.closest<BuiField>("bui-field");
    this.#unregisterAux = this.root?.field.registerAux({
      element: this,
      requestUpdate: () => this.requestUpdate(),
    }) ?? null;
  }

  override disconnectedCallback(): void {
    this.unregister?.();
    this.unregister = null;
    this.#unregisterAux?.();
    this.#unregisterAux = null;
    super.disconnectedCallback();
  }
}

export class BuiFieldLabel extends FieldPart {
  static tagName = "bui-field-label" as const;
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.field.labelProps);
  }
}

export class BuiFieldDescription extends FieldPart {
  static tagName = "bui-field-description" as const;
  override connectedCallback(): void {
    super.connectedCallback();
    this.unregister = this.root?.field.registerDescription() ?? null;
  }
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.field.descriptionProps);
  }
}

export class BuiFieldError extends FieldPart {
  static tagName = "bui-field-error" as const;
  override connectedCallback(): void {
    super.connectedCallback();
    this.unregister = this.root?.field.registerError() ?? null;
  }
  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.field.errorProps);
  }
}

export const fieldFamily = [
  BuiField,
  BuiFieldLabel,
  BuiFieldDescription,
  BuiFieldError,
] as const;

defineFamily(fieldFamily);
