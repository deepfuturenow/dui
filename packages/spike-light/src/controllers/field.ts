/**
 * `FieldController` (probe P3), designed from the P3.1 reading of DUI's
 * field.ts (294 lines). What that reading found, and what changes:
 *
 * - DUI finds its control with a hardcoded 13-tag selector over the default
 *   slot. BUI controls REGISTER with the field they sit in (closest()), so
 *   the list disappears and any control can participate.
 * - DUI wires aria-describedby/aria-invalid onto the control's shadow HOST,
 *   where they cannot reach the real input without cross-root ARIA. BUI
 *   hands the control an `aria` snapshot; the control applies it to its real
 *   <input>, which shares the field's tree scope, so the references resolve
 *   natively.
 * - DUI's label click focuses only. BUI's label click ACTIVATES: the control
 *   registers an activate() (toggle for checkbox/switch, focus for text).
 * - State (dirty/touched/focused/filled) from focusin/focusout/input/change,
 *   disabled propagation, and invalid-as-a-property port unchanged.
 */
import { type Bag, markBag } from "../core/bags.ts";
import { CompoundController } from "../core/compound-controller.ts";

export type FieldRootBag = Bag<"field:root">;
export type FieldLabelBag = Bag<"field:label">;
export type FieldDescriptionBag = Bag<"field:description">;
export type FieldErrorBag = Bag<"field:error">;

export type FieldAria = {
  describedBy: string | undefined;
  labelledBy: string;
  invalid: boolean;
  disabled: boolean;
};

export type FieldControl = {
  activate: () => void;
  /** Re-apply ARIA; called when field state changes. */
  syncAria: (aria: FieldAria) => void;
};

export type FieldControllerOptions = {
  getDisabled: () => boolean;
  getInvalid: () => boolean;
};

let nextId = 1;

export class FieldController extends CompoundController<void> {
  #opts: FieldControllerOptions;
  #id = nextId++;
  #labelId = `bui-field-${this.#id}-label`;
  #descriptionId = `bui-field-${this.#id}-desc`;
  #errorId = `bui-field-${this.#id}-error`;

  #control: FieldControl | null = null;
  #hasDescription = false;
  #hasError = false;
  #dirty = false;
  #touched = false;
  #focused = false;
  #filled = false;

  constructor(options: FieldControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    // Fan out every host update to the registered parts: label, description
    // and error carry state-dependent attributes (data-disabled,
    // data-invalid) but render nothing, so nothing else would re-run their
    // applyProps. Probe P3 caught exactly this: field.disabled = true left
    // the label's data-disabled stale. Parts-only, or notify() would loop.
    this.host.addLifecycle({
      updated: () => {
        this.#pushAria();
        this.notifyParts();
      },
    });
  }

  get aria(): FieldAria {
    const parts: string[] = [];
    if (this.#hasDescription) parts.push(this.#descriptionId);
    if (this.#opts.getInvalid() && this.#hasError) parts.push(this.#errorId);
    return {
      describedBy: parts.join(" ") || undefined,
      labelledBy: this.#labelId,
      invalid: this.#opts.getInvalid(),
      disabled: this.#opts.getDisabled(),
    };
  }

  /** Called by the control inside this field. Returns unregister. */
  registerControl(control: FieldControl): () => void {
    this.#control = control;
    queueMicrotask(() => this.#pushAria());
    return () => {
      if (this.#control === control) this.#control = null;
    };
  }

  registerDescription(): () => void {
    this.#hasDescription = true;
    this.#pushAria();
    return () => {
      this.#hasDescription = false;
    };
  }

  registerError(): () => void {
    this.#hasError = true;
    this.#pushAria();
    return () => {
      this.#hasError = false;
    };
  }

  #pushAria(): void {
    this.#control?.syncAria(this.aria);
  }

  get rootProps(): FieldRootBag {
    return markBag("field:root", {
      role: "group",
      "?data-disabled": this.#opts.getDisabled(),
      "?data-invalid": this.#opts.getInvalid(),
      "?data-valid": !this.#opts.getInvalid(),
      "?data-dirty": this.#dirty,
      "?data-touched": this.#touched,
      "?data-focused": this.#focused,
      "?data-filled": this.#filled,
      "@focusin": () => {
        this.#focused = true;
        this.host.requestUpdate();
      },
      "@focusout": () => {
        this.#focused = false;
        this.#touched = true;
        this.host.requestUpdate();
      },
      "@input": () => {
        this.#dirty = true;
        this.#filled = true;
        this.host.requestUpdate();
      },
      "@change": () => {
        this.#dirty = true;
        this.host.requestUpdate();
      },
    }, () => {});
  }

  get labelProps(): FieldLabelBag {
    return markBag("field:label", {
      id: this.#labelId,
      "?data-disabled": this.#opts.getDisabled(),
      "@click": () => {
        if (!this.#opts.getDisabled()) this.#control?.activate();
      },
    }, () => {});
  }

  get descriptionProps(): FieldDescriptionBag {
    return markBag("field:description", { id: this.#descriptionId }, () => {});
  }

  get errorProps(): FieldErrorBag {
    return markBag("field:error", {
      id: this.#errorId,
      role: "alert",
      "?data-invalid": this.#opts.getInvalid(),
    }, () => {});
  }
}
