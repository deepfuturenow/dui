/**
 * `CheckboxController` (probe P3) — also serves switch with a role option,
 * which answers the spec's Phase 2 #6 question in the affirmative.
 *
 * Anatomy: the host is form-associated (ElementInternals passed in, owned by
 * the host); the interactive element is a real, NAMELESS <input> rendered by
 * the component. Nameless, so it never submits itself — the host's
 * internals.setFormValue carries the value under the host's name. The real
 * input gives keyboard, click, focus, and label semantics for free, and ARIA
 * ids resolve natively because everything shares the field's tree scope.
 */
import { type Bag, markBag } from "../core/bags.ts";
import { Controller } from "../core/controller-host.ts";
import type { FieldAria } from "./field.ts";

export type CheckboxInputBag = Bag<"checkbox:input">;
export type CheckboxRootBag = Bag<"checkbox:root">;

export type CheckboxControllerOptions = {
  getChecked: () => boolean;
  getValue: () => string;
  getRequired: () => boolean;
  getDisabled: () => boolean;
  getInternals: () => ElementInternals;
  role?: "checkbox" | "switch";
  onChange: (checked: boolean) => void;
};

export class CheckboxController extends Controller {
  #opts: CheckboxControllerOptions;
  #inputEl: HTMLInputElement | null = null;
  #fieldAria: FieldAria | null = null;

  constructor(options: CheckboxControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    this.host.addLifecycle({ updated: () => this.#syncForm() });
  }

  /** FieldControl implementation for FieldController.registerControl. */
  get fieldControl() {
    return {
      activate: () => {
        this.#inputEl?.click();
        this.#inputEl?.focus();
      },
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
    const checked = this.#opts.getChecked();
    internals.setFormValue(checked ? this.#opts.getValue() : null);
    if (this.#opts.getRequired() && !checked) {
      internals.setValidity(
        { valueMissing: true },
        "Please check this box.",
        this.#inputEl ?? undefined,
      );
    } else {
      internals.setValidity({});
    }
  }

  get rootProps(): CheckboxRootBag {
    return markBag("checkbox:root", {
      "?data-checked": this.#opts.getChecked(),
      "?data-disabled": this.#opts.getDisabled(),
      "data-state": this.#opts.getChecked() ? "checked" : "unchecked",
    }, () => {});
  }

  get inputProps(): CheckboxInputBag {
    return markBag("checkbox:input", {
      ref: (el: Element | null) => {
        this.#inputEl = el as HTMLInputElement | null;
        this.#applyAria();
      },
      type: "checkbox",
      role: this.#opts.role === "switch" ? "switch" : undefined,
      ".checked": this.#opts.getChecked(),
      "?disabled": this.#opts.getDisabled(),
      "@change": (e: Event) => {
        this.#opts.onChange((e.target as HTMLInputElement).checked);
      },
    }, () => {});
  }
}
