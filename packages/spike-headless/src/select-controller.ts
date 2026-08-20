/**
 * `SelectController` — the behavior of `<dui-select>` with no template.
 *
 * Extracted from `DuiSelectPrimitive` (545 lines) by deleting its `render()`
 * and replacing its nine `querySelector(".ClassName")` calls with refs the
 * consumer attaches. `dui-primitives` is untouched; this is a copy.
 *
 * The contract is prop bags: each getter returns a plain object to spread onto
 * one element in the consumer's own markup. Nothing here knows a class name, a
 * part name, or a tag name.
 */
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { FloatingTopLayerController } from "./vendor-core/floating-top-layer-controller.ts";
import { ReopenGuard } from "./vendor-core/floating-popup-utils.ts";
import type { SpreadProps } from "./spread.ts";

export type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

/**
 * Everything the controller used to read from host properties, as getters.
 *
 * Getters rather than a snapshot passed once, and rather than the controller
 * reading named properties off the host. A snapshot goes stale on every update.
 * Reading `host.value` / `host.options` would work, but it re-couples the
 * controller to a naming convention on the host — the same class of undocumented
 * coupling the class-name lookups were, just moved. Getters cost the consumer
 * one arrow function each and let host state live anywhere. See FINDINGS.
 */
export type SelectControllerOptions = {
  getOptions: () => SelectOption[];
  getValue: () => string;
  getPlaceholder: () => string;
  getDisabled: () => boolean;
  /** macOS-style "selected item overlays the trigger". Default: true. */
  getAlignItemToTrigger?: () => boolean;
  /** Called when the user commits a selection. The host owns `value`. */
  onChange: (value: string, option: SelectOption) => void;
};

type Host = ReactiveControllerHost & HTMLElement;

/** A scroll container that may delegate scrolling to an inner viewport. */
type ScrollerHost = HTMLElement & { scrollViewport?: HTMLElement | null };

export class SelectController implements ReactiveController {
  #host: Host;
  #opts: SelectControllerOptions;

  #highlightedIndex = -1;
  #reopenGuard = new ReopenGuard();

  #triggerId = `select-trigger-${crypto.randomUUID().slice(0, 8)}`;
  #listboxId = `select-listbox-${crypto.randomUUID().slice(0, 8)}`;

  // Elements the consumer attaches through the `ref` key in each prop bag.
  #triggerEl: HTMLElement | null = null;
  #popupEl: HTMLElement | null = null;
  #valueEl: HTMLElement | null = null;
  #scrollerHostEl: ScrollerHost | null = null;
  #itemEls = new Map<number, HTMLElement>();

  /**
   * The element that actually scrolls, resolved lazily.
   *
   * Not resolved at ref time. A `ref` callback fires when the element is
   * created, which for a custom element is before its own shadow DOM exists, so
   * `scrollViewport` is still null then. Snapshotting it there silently yields
   * the host element instead of the viewport, and every scrollHeight test
   * downstream reads the wrong box. See FINDINGS question 2.
   */
  get #scrollerEl(): HTMLElement | null {
    return this.#scrollerHostEl?.scrollViewport ?? this.#scrollerHostEl ?? null;
  }

  #popup: FloatingTopLayerController;

  constructor(host: Host, options: SelectControllerOptions) {
    this.#host = host;
    this.#opts = options;
    host.addController(this);

    this.#popup = new FloatingTopLayerController(host, {
      getAnchor: () => this.#triggerEl,
      getPopover: () => this.#popupEl,
      matchWidth: false,
      minMatchWidth: true,
      alignToInner: () => {
        if (!this.#alignItemToTrigger) return null;
        const selected = this.#itemEls.get(this.#selectedIndex) ?? null;
        // The item's text node is what should line up with the trigger's text.
        // The consumer marks it with `data-select-item-text`; that attribute is
        // published by `itemTextProps`, so this is the controller reading its
        // own contract, not guessing at the consumer's markup.
        return selected?.querySelector<HTMLElement>(
          "[data-select-item-text]",
        ) ??
          selected;
      },
      alignToInnerReference: () =>
        this.#alignItemToTrigger ? this.#valueEl : null,
      // Without this the middleware finds the scroller by the class name
      // `.Popup`, which does not exist in consumer-owned markup.
      getScrollContainer: () => this.#scrollerEl ?? this.#popupEl,
      onOpen: () => {
        this.#highlightedIndex = this.#selectedIndex;
        this.#host.requestUpdate();
        this.#host.updateComplete.then(() => this.#scrollSelectedIntoView());
      },
      onClose: () => {
        this.#highlightedIndex = -1;
        this.#reopenGuard.noteClose();
        this.#host.requestUpdate();
      },
    });
  }

  hostDisconnected(): void {
    this.#itemEls.clear();
  }

  /**
   * Dev-mode spread check.
   *
   * Under this model the consumer owns the markup, so ARIA correctness depends
   * on them spreading the right bag on the right element. A forgotten
   * `${spread(c.listboxProps)}` costs `role="listbox"` and
   * `aria-activedescendant` and shows no visible symptom.
   *
   * This is the cheap version: after the first update, check that the elements
   * the controller needs got attached, and that one sentinel attribute from
   * each bag actually landed. Roughly 25 lines, runs once, and would be
   * stripped in a production build.
   *
   * What it does NOT catch: a bag spread on the *wrong* element, or the
   * controller itself putting a handler in the wrong bag (Step 5 probe 3).
   * Those need tests, not assertions.
   */
  hostUpdated(): void {
    if (this.#checked) return;
    this.#checked = true;

    const problems: string[] = [];
    if (!this.#triggerEl) problems.push("triggerProps was never spread");
    if (!this.#popupEl) problems.push("popupProps was never spread");
    if (!this.#valueEl) {
      problems.push(
        "valueProps was never spread (inner alignment will be off)",
      );
    }
    if (!this.#scrollerHostEl) {
      problems.push(
        "scrollerProps was never spread (long lists will mis-position)",
      );
    }
    if (this.#triggerEl?.getAttribute("role") !== "combobox") {
      problems.push("the element with triggerProps has no role=combobox");
    }
    const listbox = this.#popupEl?.querySelector("[role='listbox']");
    if (!listbox) problems.push("listboxProps was never spread");
    if (this.options.length > 0 && this.#itemEls.size === 0) {
      problems.push("itemProps(index) was never spread on any option");
    }

    if (problems.length) {
      console.warn(
        `[SelectController] on <${this.#host.localName}>:\n  - ${
          problems.join("\n  - ")
        }`,
      );
    }
  }

  #checked = false;

  // ---- Read-only state -----------------------------------------------------

  get isOpen(): boolean {
    return this.#popup.isOpen;
  }

  get options(): SelectOption[] {
    return this.#opts.getOptions();
  }

  get selectedOption(): SelectOption | undefined {
    return this.options.find((o) => o.value === this.#opts.getValue());
  }

  get displayValue(): string {
    return this.selectedOption?.label ?? this.#opts.getPlaceholder();
  }

  get hasValue(): boolean {
    return this.#opts.getValue() !== "" && this.selectedOption != null;
  }

  get highlightedIndex(): number {
    return this.#highlightedIndex;
  }

  get #selectedIndex(): number {
    return this.options.findIndex((o) => o.value === this.#opts.getValue());
  }

  get #alignItemToTrigger(): boolean {
    return this.#opts.getAlignItemToTrigger?.() ?? true;
  }

  // ---- Prop bags -----------------------------------------------------------

  get triggerProps(): SpreadProps {
    const disabled = this.#opts.getDisabled();
    return {
      ref: (el: Element | null) => this.#triggerEl = el as HTMLElement | null,
      id: this.#triggerId,
      role: "combobox",
      tabindex: disabled ? -1 : 0,
      "aria-haspopup": "listbox",
      "aria-expanded": String(this.isOpen),
      "aria-controls": this.#listboxId,
      "aria-activedescendant": this.#highlightedIndex >= 0
        ? `${this.#listboxId}-option-${this.#highlightedIndex}`
        : undefined,
      "?data-disabled": disabled,
      "?data-open": this.isOpen,
      "@click": this.#onTriggerClick,
      "@keydown": this.#onTriggerKeyDown,
    };
  }

  get valueProps(): SpreadProps {
    return {
      ref: (el: Element | null) => this.#valueEl = el as HTMLElement | null,
      "?data-placeholder": !this.hasValue,
    };
  }

  get popupProps(): SpreadProps {
    return {
      ref: (el: Element | null) => this.#popupEl = el as HTMLElement | null,
      popover: "auto",
      "?data-align-inner": this.#alignItemToTrigger &&
        this.#opts.getValue() !== "",
      "@toggle": this.#popup.handleToggle,
    };
  }

  /** Attach to whatever element actually scrolls — often a `<dui-scroll-area>`. */
  get scrollerProps(): SpreadProps {
    return {
      ref: (el: Element | null) => {
        this.#scrollerHostEl = el as ScrollerHost | null;
      },
    };
  }

  get listboxProps(): SpreadProps {
    return {
      id: this.#listboxId,
      role: "listbox",
      "aria-labelledby": this.#triggerId,
      "@mousedown": this.#onListMouseDown,
    };
  }

  itemProps(index: number): SpreadProps {
    const option = this.options[index];
    const isSelected = option?.value === this.#opts.getValue();
    const isHighlighted = index === this.#highlightedIndex;

    return {
      ref: (el: Element | null) => {
        if (el) this.#itemEls.set(index, el as HTMLElement);
        else this.#itemEls.delete(index);
      },
      id: `${this.#listboxId}-option-${index}`,
      role: "option",
      "aria-selected": String(isSelected),
      "?data-selected": isSelected,
      "?data-highlighted": isHighlighted,
      "?data-disabled": !!option?.disabled,
      "@click": () => this.#onItemClick(index),
      "@mouseenter": () => this.#onItemMouseEnter(index),
    };
  }

  /** Marks the item's label so inner alignment can find it. */
  get itemTextProps(): SpreadProps {
    return { "data-select-item-text": "" };
  }

  // ---- Imperative API ------------------------------------------------------

  open(): void {
    if (!this.#reopenGuard.allowOpen()) return;
    this.#popup.open();
  }

  close(): void {
    this.#popup.close();
  }

  // ---- Handlers ------------------------------------------------------------

  #onTriggerClick = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.#opts.getDisabled()) return;
    if (this.#popup.isOpen) this.#popup.close();
    else this.open();
  };

  #onTriggerKeyDown = (event: KeyboardEvent): void => {
    if (this.#opts.getDisabled()) return;

    switch (event.key) {
      case "Enter":
      case " ": {
        event.preventDefault();
        if (this.#popup.isOpen) {
          const option = this.options[this.#highlightedIndex];
          if (option && !option.disabled) this.#selectOption(option);
        } else {
          this.open();
        }
        break;
      }
      case "ArrowDown": {
        event.preventDefault();
        if (!this.#popup.isOpen) this.open();
        else {this.#moveHighlight(
            this.#nextEnabledIndex(this.#highlightedIndex, 1),
          );}
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!this.#popup.isOpen) this.open();
        else {this.#moveHighlight(
            this.#nextEnabledIndex(this.#highlightedIndex, -1),
          );}
        break;
      }
      case "Home": {
        if (!this.#popup.isOpen) break;
        event.preventDefault();
        this.#moveHighlight(this.#nextEnabledIndex(-1, 1));
        break;
      }
      case "End": {
        if (!this.#popup.isOpen) break;
        event.preventDefault();
        this.#moveHighlight(this.#nextEnabledIndex(this.options.length, -1));
        break;
      }
      case "Escape": {
        if (!this.#popup.isOpen) break;
        event.preventDefault();
        this.#popup.close();
        this.#focusTrigger();
        break;
      }
      case "Tab": {
        if (this.#popup.isOpen) this.#popup.close();
        break;
      }
    }
  };

  #onListMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
  };

  #onItemClick = (index: number): void => {
    const option = this.options[index];
    if (!option || option.disabled) return;
    this.#selectOption(option);
  };

  #onItemMouseEnter = (index: number): void => {
    if (!this.options[index]?.disabled) {
      this.#highlightedIndex = index;
      this.#host.requestUpdate();
    }
  };

  // ---- Selection and navigation --------------------------------------------

  #selectOption(option: SelectOption): void {
    this.#opts.onChange(option.value, option);
    this.#popup.close();
    this.#focusTrigger();
  }

  #nextEnabledIndex(current: number, direction: 1 | -1): number {
    const options = this.options;
    let next = current + direction;
    while (next >= 0 && next < options.length) {
      if (!options[next].disabled) return next;
      next += direction;
    }
    return current;
  }

  #focusTrigger(): void {
    this.#triggerEl?.focus();
  }

  #moveHighlight(index: number): void {
    this.#highlightedIndex = index;
    this.#host.requestUpdate();
    this.#host.updateComplete.then(() => {
      this.#itemEls.get(index)?.scrollIntoView({ block: "nearest" });
    });
  }

  #scrollSelectedIntoView(): void {
    const item = this.#itemEls.get(this.#selectedIndex);
    const scroller = this.#scrollerEl ?? this.#popupEl;
    if (!item || !scroller) return;
    if (scroller.scrollHeight <= scroller.clientHeight) return;

    const itemRect = item.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const itemTop = itemRect.top - scrollerRect.top + scroller.scrollTop;
    scroller.scrollTop = itemTop -
      (scroller.clientHeight - itemRect.height) / 2;
  }
}
