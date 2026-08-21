/**
 * `InputController` (probe P3) — a text control on the same anatomy as
 * checkbox: form-associated host, real nameless <input> for interaction,
 * validity mirrored from the native input onto the host's internals so
 * :invalid / :user-invalid match on the host.
 */
import { type Bag, markBag } from "../core/bags.ts";
import { Controller } from "../core/controller-host.ts";
import type { FieldAria } from "./field.ts";

export type InputInputBag = Bag<"input:input">;

export type InputControllerOptions = {
  getValue: () => string;
  getPlaceholder: () => string;
  getRequired: () => boolean;
  getDisabled: () => boolean;
  getType: () => string;
  getInternals: () => ElementInternals;
  onInput: (value: string) => void;
};

export class InputController extends Controller {
  #opts: InputControllerOptions;
  #inputEl: HTMLInputElement | null = null;
  #fieldAria: FieldAria | null = null;

  constructor(options: InputControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    this.host.addLifecycle({ updated: () => this.#syncForm() });
  }

  get fieldControl() {
    return {
      activate: () => this.#inputEl?.focus(),
      syncAria: (aria: FieldAria) => {
        this.#fieldAria = aria;
        this.#applyAria();
      },
    };
  }

  #applyAria(): void {
    const input = this.#inputEl;
    const aria = this.#fieldAria;
    if (!input || !aria) return;
    if (aria.describedBy) input.setAttribute("aria-describedby", aria.describedBy);
    else input.removeAttribute("aria-describedby");
    input.setAttribute("aria-labelledby", aria.labelledBy);
    input.setAttribute("aria-invalid", String(aria.invalid));
    // DUI-parity disabled propagation: a disabled field disables its control.
    if (aria.disabled) input.setAttribute("disabled", "");
    else if (!this.#opts.getDisabled()) input.removeAttribute("disabled");
  }

  #syncForm(): void {
    const internals = this.#opts.getInternals();
    internals.setFormValue(this.#opts.getValue());
    const native = this.#inputEl;
    if (native && !native.validity.valid) {
      internals.setValidity(
        { valueMissing: native.validity.valueMissing, typeMismatch: native.validity.typeMismatch },
        native.validationMessage,
        native,
      );
    } else {
      internals.setValidity({});
    }
  }

  get inputProps(): InputInputBag {
    return markBag("input:input", {
      ref: (el: Element | null) => {
        this.#inputEl = el as HTMLInputElement | null;
        this.#applyAria();
      },
      type: this.#opts.getType(),
      placeholder: this.#opts.getPlaceholder() || undefined,
      ".value": this.#opts.getValue(),
      "?required": this.#opts.getRequired(),
      "?disabled": this.#opts.getDisabled(),
      "@input": (e: Event) => {
        this.#opts.onInput((e.target as HTMLInputElement).value);
      },
    }, () => {});
  }
}
