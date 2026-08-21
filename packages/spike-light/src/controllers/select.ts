/**
 * `SelectController`, compound form (probe P4).
 *
 * Experiment 2's SelectController took an `options` array and rendered rows
 * itself. Here options are consumer-authored `<bui-select-option>` elements
 * that register on connect (CompoundController), so the option SET lives in
 * the markup. Keyboard model, selection, and floating positioning are ported
 * unchanged. The popup element IS the listbox and IS the scroller — no
 * scroll-area dependency, which also supplies the injectable
 * getScrollContainer that P6's fixed core now requires.
 */
import { type Bag, markBag } from "../core/bags.ts";
import {
  CompoundController,
  type PartHost,
} from "../core/compound-controller.ts";
import { DevCheck } from "../core/dev-check.ts";
import { FloatingTopLayerController } from "../vendor-core/floating-top-layer-controller.ts";
import { ReopenGuard } from "../vendor-core/floating-popup-utils.ts";

export type SelectTriggerBag = Bag<"select:trigger">;
export type SelectValueBag = Bag<"select:value">;
export type SelectPopupBag = Bag<"select:popup">;
export type SelectOptionBag = Bag<"select:option">;

export type SelectOptionData = {
  getValue: () => string;
  getLabel: () => string;
  getDisabled: () => boolean;
};

export type SelectControllerOptions = {
  getValue: () => string;
  getPlaceholder: () => string;
  getDisabled: () => boolean;
  getAlignItemToTrigger: () => boolean;
  onChange: (value: string) => void;
};

let nextId = 1;

export class SelectController extends CompoundController<SelectOptionData> {
  #opts: SelectControllerOptions;
  #highlightedIndex = -1;
  #reopenGuard = new ReopenGuard();
  #id = nextId++;
  #triggerId = `bui-select-trigger-${this.#id}`;
  #listboxId = `bui-select-listbox-${this.#id}`;

  #triggerEl: HTMLElement | null = null;
  #valueEl: HTMLElement | null = null;
  #popupEl: HTMLElement | null = null;

  #popup: FloatingTopLayerController | null = null;
  #devCheck: DevCheck | null = null;

  constructor(options: SelectControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    this.#popup = new FloatingTopLayerController(this.host, {
      getAnchor: () => this.#triggerEl,
      getPopover: () => this.#popupEl,
      minMatchWidth: true,
      alignToInner: () => {
        if (!this.#opts.getAlignItemToTrigger()) return null;
        const el = this.parts[this.#selectedIndex]?.part.element;
        if (!el) return null;
        // Align the option's TEXT, not its box: the ::before indicator sits
        // inside the box, so box-alignment lands ~30px right of DUI's
        // ItemText alignment. There is no label element to point at — the
        // label is the consumer's bare text — so measure the text with a
        // Range and hand core a virtual element. The cast works because
        // alignInner only calls getBoundingClientRect; the honest fix is for
        // core to accept Floating UI's VirtualElement here (FINDINGS).
        const textNode = [...el.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
        );
        if (!textNode) return el;
        const range = document.createRange();
        range.selectNodeContents(textNode);
        return {
          getBoundingClientRect: () => range.getBoundingClientRect(),
        } as unknown as HTMLElement;
      },
      alignToInnerReference: () =>
        this.#opts.getAlignItemToTrigger() ? this.#valueEl : null,
      getScrollContainer: () => this.#popupEl,
      onOpen: () => {
        this.#highlightedIndex = this.#selectedIndex;
        this.notify();
        // After parts re-render and positioning lands, center the selection —
        // the long-list path where align-inner has fallen back to anchored.
        requestAnimationFrame(() => this.#scrollSelectedIntoView());
      },
      onClose: () => {
        this.#highlightedIndex = -1;
        this.#reopenGuard.noteClose();
        this.notify();
      },
    });
    this.#devCheck = new DevCheck(this.host, () => "bui-select", [
      { name: "select:trigger", ref: true },
      { name: "select:popup", ref: true },
    ]);
    this.host.addLifecycle({ disconnected: () => this.#popup?.dispose() });
  }

  // ---- State ---------------------------------------------------------------

  get isOpen(): boolean {
    return this.#popup?.isOpen ?? false;
  }

  get #selectedIndex(): number {
    return this.parts.findIndex((e) =>
      e.data.getValue() === this.#opts.getValue()
    );
  }

  get selectedLabel(): string | null {
    const entry = this.parts[this.#selectedIndex];
    return entry ? entry.data.getLabel() : null;
  }

  get displayValue(): string {
    return this.selectedLabel ?? this.#opts.getPlaceholder();
  }

  get hasValue(): boolean {
    return this.selectedLabel !== null;
  }

  open(): void {
    if (!this.#reopenGuard.allowOpen()) return;
    this.#popup?.open();
  }

  close(): void {
    this.#popup?.close();
  }

  // ---- Bags ----------------------------------------------------------------

  get triggerProps(): SelectTriggerBag {
    const disabled = this.#opts.getDisabled();
    const bag = markBag("select:trigger", {
      ref: (el: Element | null) => {
        this.#triggerEl = el as HTMLElement | null;
        if (el) this.#devCheck?.refAttached("select:trigger");
      },
      id: this.#triggerId,
      role: "combobox",
      tabindex: disabled ? -1 : 0,
      "aria-haspopup": "listbox",
      "aria-expanded": String(this.isOpen),
      "aria-controls": this.#listboxId,
      "aria-activedescendant": this.#highlightedIndex >= 0
        ? this.#optionId(this.#highlightedIndex)
        : undefined,
      "?data-disabled": disabled,
      "?data-open": this.isOpen,
      "@click": this.#onTriggerClick,
      "@keydown": this.#onTriggerKeyDown,
    }, () => this.#devCheck?.bagApplied("select:trigger"));
    return bag;
  }

  get valueProps(): SelectValueBag {
    return markBag("select:value", {
      ref: (el: Element | null) => {
        this.#valueEl = el as HTMLElement | null;
      },
      "?data-placeholder": !this.hasValue,
    }, () => {});
  }

  get popupProps(): SelectPopupBag {
    return markBag("select:popup", {
      ref: (el: Element | null) => {
        this.#popupEl = el as HTMLElement | null;
        if (el) this.#devCheck?.refAttached("select:popup");
      },
      id: this.#listboxId,
      role: "listbox",
      "aria-labelledby": this.#triggerId,
      popover: "auto",
      "?data-align-inner": this.#opts.getAlignItemToTrigger() && this.hasValue,
      "@toggle": (e: Event) => this.#popup?.handleToggle(e),
      "@mousedown": (e: MouseEvent) => e.preventDefault(),
    }, () => this.#devCheck?.bagApplied("select:popup"));
  }

  optionProps(part: PartHost): SelectOptionBag {
    // Match by element, not by PartHost identity: a part constructs a fresh
    // host object per update. Found because data-selected silently never
    // landed while everything else worked — FINDINGS material for the
    // registration API (register() should probably key on element).
    const index = this.parts.findIndex((e) => e.part.element === part.element);
    const entry = this.parts[index];
    const isSelected = index === this.#selectedIndex;
    const isHighlighted = index === this.#highlightedIndex;
    const disabled = entry?.data.getDisabled() ?? false;
    return markBag("select:option", {
      id: this.#optionId(index),
      role: "option",
      "aria-selected": String(isSelected),
      "?data-selected": isSelected,
      "?data-highlighted": isHighlighted,
      "?data-disabled": disabled,
      "@click": () => this.#onOptionClick(index),
      "@mouseenter": () => this.#onOptionEnter(index),
    }, () => {});
  }

  #optionId(index: number): string {
    return `${this.#listboxId}-option-${index}`;
  }

  // ---- Interaction (ported from Experiment 2) ------------------------------

  #onTriggerClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.#opts.getDisabled()) return;
    if (this.isOpen) this.close();
    else this.open();
  };

  #onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (this.#opts.getDisabled()) return;
    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        if (this.isOpen) this.#commitIndex(this.#highlightedIndex);
        else this.open();
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (!this.isOpen) this.open();
        else this.#moveHighlight(this.#nextEnabled(this.#highlightedIndex, 1));
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!this.isOpen) this.open();
        else this.#moveHighlight(this.#nextEnabled(this.#highlightedIndex, -1));
        break;
      }
      case "Home": {
        if (!this.isOpen) break;
        event.preventDefault();
        this.#moveHighlight(this.#nextEnabled(-1, 1));
        break;
      }
      case "End": {
        if (!this.isOpen) break;
        event.preventDefault();
        this.#moveHighlight(this.#nextEnabled(this.parts.length, -1));
        break;
      }
      case "Escape": {
        if (!this.isOpen) break;
        event.preventDefault();
        this.close();
        this.#triggerEl?.focus();
        break;
      }
      case "Tab": {
        if (this.isOpen) this.close();
        break;
      }
    }
  };

  #onOptionClick(index: number): void {
    this.#commitIndex(index);
  }

  #onOptionEnter(index: number): void {
    if (!this.parts[index]?.data.getDisabled()) {
      this.#highlightedIndex = index;
      this.notify();
    }
  }

  #commitIndex(index: number): void {
    const entry = this.parts[index];
    if (!entry || entry.data.getDisabled()) return;
    this.#opts.onChange(entry.data.getValue());
    this.close();
    this.#triggerEl?.focus();
  }

  #nextEnabled(current: number, direction: 1 | -1): number {
    let next = current + direction;
    while (next >= 0 && next < this.parts.length) {
      if (!this.parts[next].data.getDisabled()) return next;
      next += direction;
    }
    return current;
  }

  #scrollSelectedIntoView(): void {
    const popup = this.#popupEl;
    const item = this.parts[this.#selectedIndex]?.part.element;
    if (!popup || !item) return;
    if (popup.scrollHeight <= popup.clientHeight) return;
    const itemRect = item.getBoundingClientRect();
    const popRect = popup.getBoundingClientRect();
    const itemTop = itemRect.top - popRect.top + popup.scrollTop;
    popup.scrollTop = itemTop - (popup.clientHeight - itemRect.height) / 2;
  }

  #moveHighlight(index: number): void {
    this.#highlightedIndex = index;
    this.notify();
    queueMicrotask(() => {
      this.parts[index]?.part.element.scrollIntoView({ block: "nearest" });
    });
  }
}
