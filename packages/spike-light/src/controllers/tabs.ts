/**
 * `TabsController` — the P7 rebuild of Experiment 2's tabs controller on top
 * of `CompoundController`.
 *
 * What this file no longer contains, because the base class absorbed it:
 *
 *   - the registration protocol (`registerTab` / unregister / re-sort by
 *     document position) → `register()` / `registerAux()`
 *   - the update fan-out (`#parts` set + `#requestUpdateEverywhere`) →
 *     `notify()` / `notifyParts()`
 *   - `@lit/context` and the context-payload-identity workaround entirely —
 *     parts reach the controller through their root element, not a context
 *
 * What stays, because it is genuinely tabs behavior: selection state,
 * roving focus per the W3C APG tabs pattern (the library's primitive has the
 * roving-tabindex SHAPE but never moves focus), and indicator measurement.
 */
import { type Bag, markBag } from "../core/bags.ts";
import {
  CompoundController,
  type PartHost,
} from "../core/compound-controller.ts";

export type TabsRootBag = Bag<"tabs:root">;
export type TabsListBag = Bag<"tabs:list">;
export type TabsTabBag = Bag<"tabs:tab">;
export type TabsPanelBag = Bag<"tabs:panel">;

export type TabsOrientation = "horizontal" | "vertical";

export type TabData = {
  getValue: () => string;
  getDisabled: () => boolean;
};

export type TabsControllerOptions = {
  /** Controlled value. `undefined` means uncontrolled. */
  getValue: () => string | undefined;
  getDefaultValue: () => string | undefined;
  getOrientation: () => TabsOrientation;
  /** Fired on every selection, controlled or not. */
  onChange: (value: string) => void;
};

let nextId = 1;

export class TabsController extends CompoundController<TabData> {
  #opts: TabsControllerOptions;

  /** Uncontrolled value. Lives here rather than on the host: it is state. */
  #internalValue: string | undefined = undefined;

  #id = nextId++;
  #listEl: HTMLElement | null = null;
  #resizeObserver: ResizeObserver | null = null;

  constructor(options: TabsControllerOptions) {
    super();
    this.#opts = options;
  }

  protected override onAttach(): void {
    this.host.addLifecycle({
      connected: () => {
        if (this.#opts.getValue() === undefined) {
          const initial = this.#opts.getDefaultValue();
          if (initial !== undefined) this.#internalValue = initial;
        }
        this.#resizeObserver = new ResizeObserver(() =>
          this.measureIndicator()
        );
        if (this.#listEl) this.#resizeObserver.observe(this.#listEl);
      },
      disconnected: () => {
        this.#resizeObserver?.disconnect();
        this.#resizeObserver = null;
      },
      // Tabs register AFTER the root's first update (children upgrade later),
      // and each registration only reaches the root. Fanning out from the
      // root's updated hook is what keeps the list re-measuring and the
      // panels re-hiding without the root knowing who its parts are.
      updated: () => this.notifyParts(),
    });
  }

  // ---- State ---------------------------------------------------------------

  get value(): string | undefined {
    return this.#opts.getValue() ?? this.#internalValue;
  }

  get orientation(): TabsOrientation {
    return this.#opts.getOrientation();
  }

  isActive(value: string): boolean {
    return this.value === value;
  }

  select(value: string): void {
    if (this.#opts.getValue() === undefined) this.#internalValue = value;
    this.#opts.onChange(value);
    this.notify();
  }

  // ---- Bags ----------------------------------------------------------------

  get rootProps(): TabsRootBag {
    return markBag("tabs:root", {
      "data-orientation": this.orientation,
    }, () => {});
  }

  get listProps(): TabsListBag {
    return markBag("tabs:list", {
      ref: (el: Element | null) => {
        if (this.#listEl && this.#resizeObserver) {
          this.#resizeObserver.unobserve(this.#listEl);
        }
        this.#listEl = el as HTMLElement | null;
        if (this.#listEl && this.#resizeObserver) {
          this.#resizeObserver.observe(this.#listEl);
        }
      },
      role: "tablist",
      "aria-orientation": this.orientation,
      "data-orientation": this.orientation,
    }, () => {});
  }

  tabProps(part: PartHost): TabsTabBag {
    // Match by element, same as SelectController.optionProps: parts hand in
    // a fresh PartHost object per update, so identity would never match.
    const entry = this.parts.find((e) => e.part.element === part.element);
    const value = entry?.data.getValue() ?? "";
    const disabled = entry?.data.getDisabled() ?? false;
    const active = this.isActive(value);
    return markBag("tabs:tab", {
      id: this.#tabId(value),
      role: "tab",
      "aria-selected": String(active),
      "aria-controls": this.#panelId(value),
      "?data-active": active,
      "?data-disabled": disabled,
      tabindex: active && !disabled ? 0 : -1,
      "@click": () => {
        if (!disabled) this.select(value);
      },
      "@keydown": (event: KeyboardEvent) =>
        this.#onTabKeyDown(event, value, disabled),
    }, () => {});
  }

  panelProps(value: string): TabsPanelBag {
    const active = this.isActive(value);
    return markBag("tabs:panel", {
      id: this.#panelId(value),
      role: "tabpanel",
      "aria-labelledby": this.#tabId(value),
      tabindex: 0,
      "?data-hidden": !active,
    }, () => {});
  }

  #tabId(value: string): string {
    return `bui-tabs-${this.#id}-tab-${value}`;
  }

  #panelId(value: string): string {
    return `bui-tabs-${this.#id}-panel-${value}`;
  }

  // ---- Indicator -----------------------------------------------------------

  /**
   * Publish the active tab's position on the list element. Called by the list
   * part from its own updated hook — the measurement must run after the tabs
   * have laid out, and the root's update does not await its light-DOM
   * children's updates.
   */
  measureIndicator(): void {
    const list = this.#listEl;
    if (!list) return;
    const active = this.parts.find((e) => e.data.getValue() === this.value);
    if (!active) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = active.part.element.getBoundingClientRect();
    list.style.setProperty(
      "--active-tab-left",
      `${tabRect.left - listRect.left}px`,
    );
    list.style.setProperty(
      "--active-tab-top",
      `${tabRect.top - listRect.top}px`,
    );
    list.style.setProperty("--active-tab-width", `${tabRect.width}px`);
    list.style.setProperty("--active-tab-height", `${tabRect.height}px`);
  }

  // ---- Handlers ------------------------------------------------------------

  #onTabKeyDown = (
    event: KeyboardEvent,
    value: string,
    disabled: boolean,
  ): void => {
    if (disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.select(value);
      return;
    }

    // Roving focus, per the W3C APG tabs pattern. Short because the
    // controller knows the whole tab set from registration.
    const forward = this.orientation === "vertical"
      ? "ArrowDown"
      : "ArrowRight";
    const back = this.orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

    let target: HTMLElement | undefined;
    if (event.key === forward) target = this.#step(value, 1);
    else if (event.key === back) target = this.#step(value, -1);
    else if (event.key === "Home") target = this.#edge(1);
    else if (event.key === "End") target = this.#edge(-1);
    else return;

    if (!target) return;
    event.preventDefault();
    target.focus();
  };

  /** Next enabled tab in `direction`, wrapping, skipping disabled ones. */
  #step(from: string, direction: 1 | -1): HTMLElement | undefined {
    const tabs = this.parts;
    const start = tabs.findIndex((e) => e.data.getValue() === from);
    if (start < 0 || tabs.length === 0) return undefined;
    for (let i = 1; i <= tabs.length; i++) {
      const index = (start + direction * i + tabs.length * tabs.length) %
        tabs.length;
      const candidate = tabs[index];
      if (
        candidate && !candidate.data.getDisabled() &&
        candidate.data.getValue() !== from
      ) {
        return candidate.part.element;
      }
    }
    return undefined;
  }

  /** First (1) or last (-1) enabled tab. */
  #edge(direction: 1 | -1): HTMLElement | undefined {
    const tabs = direction === 1 ? this.parts : [...this.parts].reverse();
    return tabs.find((e) => !e.data.getDisabled())?.part.element;
  }
}
