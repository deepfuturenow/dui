/**
 * `TabsController` — the behavior of the tabs family with no templates.
 *
 * The second conversion in this spike, chosen because tabs is a *compound*
 * component: five elements the consuming app composes in its own light DOM,
 * coordinated through `@lit/context`. Select was one element and answered
 * nothing about this case.
 *
 * The design decision this file embodies: **the context payload is the
 * controller itself**, not a plain data object. One controller instance lives on
 * the root element; every part pulls its prop bag from it. The alternative —
 * keeping a plain `{value, orientation, select}` context and giving each part
 * its own controller — was rejected because the interesting logic (which tab is
 * active, where the indicator goes, where focus moves) is inherently about the
 * *set* of tabs, and no per-part controller can see the set.
 *
 * That decision has a price, and it is the main finding of this conversion:
 * a compound controller needs a **registration protocol**. The tabs are
 * consumer-authored elements in light DOM, so the controller cannot find them.
 * Each tab registers on connect and unregisters on disconnect. See FINDINGS.
 *
 * `dui-primitives` is untouched; this is extracted from a reading of it.
 */
import type { ReactiveController, ReactiveControllerHost } from "lit";
import { createContext } from "@lit/context";
import type { SpreadProps } from "./spread.ts";

export type TabsOrientation = "horizontal" | "vertical";

export type TabsControllerOptions = {
  /** Controlled value. `undefined` means uncontrolled. */
  getValue: () => string | undefined;
  getDefaultValue: () => string | undefined;
  getOrientation: () => TabsOrientation;
  /** Fired on every selection, controlled or not. */
  onChange: (value: string) => void;
};

type Host = ReactiveControllerHost & HTMLElement;

/**
 * Descendants consume the controller instance itself.
 *
 * Deliberately a different context from the library's `tabsContext`, so an
 * owned tabs family and a library one can coexist on a page without either
 * capturing the other's parts.
 */
export const tabsControllerContext = createContext<TabsController>(
  Symbol("dui-tabs-headless"),
);

type RegisteredTab = {
  element: HTMLElement;
  value: string;
  disabled: boolean;
};

export class TabsController implements ReactiveController {
  #host: Host;
  #opts: TabsControllerOptions;

  /** Uncontrolled value. Lives here rather than on the host: it is state. */
  #internalValue: string | undefined = undefined;

  /**
   * Registered tabs, in DOM order.
   *
   * The library finds tabs with `slot.assignedElements()` filtered by
   * `el.tagName === "DUI-TAB"`. That hardcodes a tag name into the behavior
   * layer, so a consumer who owns their files and names them anything else
   * silently loses the indicator. Registration replaces it: the controller is
   * told, and never guesses.
   */
  #tabs: RegisteredTab[] = [];

  /**
   * Every part element, for update propagation.
   *
   * This is the second half of the price of making the controller itself the
   * context payload. `@consume` re-renders a consumer when the context VALUE
   * changes identity. The library rebuilds its plain `{value, orientation,
   * select}` object on every change, so consumers re-render for free. A
   * controller instance is deliberately stable, so nothing propagates and the
   * parts silently keep rendering stale state — the indicator simply never
   * moved. Every part therefore has to register so the controller can update
   * it by hand. See FINDINGS.
   */
  #parts = new Set<ReactiveControllerHost>();
  #listEl: HTMLElement | null = null;
  #resizeObserver: ResizeObserver | null = null;

  constructor(host: Host, options: TabsControllerOptions) {
    this.#host = host;
    this.#opts = options;
    host.addController(this);
  }

  hostConnected(): void {
    if (this.#opts.getValue() === undefined) {
      const initial = this.#opts.getDefaultValue();
      if (initial !== undefined) this.#internalValue = initial;
    }
    this.#resizeObserver = new ResizeObserver(() => this.measureIndicator());
  }

  hostDisconnected(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.#tabs = [];
    this.#parts.clear();
    this.#listEl = null;
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
    this.#requestUpdateEverywhere();
  }

  // ---- Registration --------------------------------------------------------

  /** Any part element joins the update set. Returns its unregister function. */
  registerPart(part: ReactiveControllerHost): () => void {
    this.#parts.add(part);
    part.requestUpdate();
    return () => {
      this.#parts.delete(part);
    };
  }

  /**
   * Called by each tab element on connect. Returns its unregister function.
   *
   * Order matters for focus movement, so the list is re-sorted by document
   * position rather than by registration order — upgrade order is not DOM
   * order when elements are defined lazily.
   */
  registerTab(
    element: HTMLElement,
    value: string,
    disabled: boolean,
  ): () => void {
    this.#tabs = [...this.#tabs.filter((t) => t.element !== element), {
      element,
      value,
      disabled,
    }].sort((a, b) =>
      a.element.compareDocumentPosition(b.element) &
        Node.DOCUMENT_POSITION_FOLLOWING
        ? -1
        : 1
    );
    this.#parts.add(element as unknown as ReactiveControllerHost);
    this.#host.requestUpdate();
    return () => {
      this.#tabs = this.#tabs.filter((t) => t.element !== element);
      this.#parts.delete(element as unknown as ReactiveControllerHost);
    };
  }

  /** Called when a registered tab's own properties change. */
  updateTab(element: HTMLElement, value: string, disabled: boolean): void {
    const tab = this.#tabs.find((t) => t.element === element);
    if (!tab) return;
    if (tab.value === value && tab.disabled === disabled) return;
    tab.value = value;
    tab.disabled = disabled;
    this.#host.requestUpdate();
  }

  // ---- Prop bags -----------------------------------------------------------

  get rootProps(): SpreadProps {
    return { "data-orientation": this.orientation };
  }

  get listProps(): SpreadProps {
    return {
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
      "data-orientation": this.orientation,
    };
  }

  tabProps(value: string, disabled = false): SpreadProps {
    const active = this.isActive(value);
    return {
      role: "tab",
      "aria-selected": String(active),
      "?data-active": active,
      "?data-disabled": disabled,
      "?disabled": disabled,
      tabindex: active ? 0 : -1,
      "@click": () => {
        if (!disabled) this.select(value);
      },
      "@keydown": (event: KeyboardEvent) =>
        this.#onTabKeyDown(event, value, disabled),
    };
  }

  panelProps(_value: string): SpreadProps {
    // `_value` is unused for now. It is in the signature because the panel's
    // ARIA wiring (`aria-labelledby` pointing at its tab) needs it, and that is
    // added in the APG pass below. Keeping the shape stable avoids a breaking
    // change to the bag two commits later.
    return {
      role: "tabpanel",
      tabindex: 0,
    };
  }

  // ---- Indicator -----------------------------------------------------------

  /**
   * Publish the active tab's position on the list element.
   *
   * Called by the owned list element from its own `updated()`, matching the
   * library's timing exactly: the measurement has to happen after the tabs have
   * laid out, and the root's `updateComplete` does not await its light-DOM
   * children's updates.
   */
  measureIndicator(): void {
    const list = this.#listEl;
    if (!list) return;
    const active = this.#tabs.find((t) => t.value === this.value);
    if (!active) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = active.element.getBoundingClientRect();
    list.style.setProperty(
      "--active-tab-left",
      `${tabRect.left - listRect.left}px`,
    );
    list.style.setProperty("--active-tab-width", `${tabRect.width}px`);
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

    // Roving focus, per the W3C APG tabs pattern.
    //
    // The library has none. `tabindex` is 0 on the active tab and -1 on the
    // rest, which is the roving-tabindex SHAPE, but nothing ever moves focus.
    // So a keyboard user can Tab onto the active tab and cannot reach any other
    // tab at all. That is not a stylistic gap; the other tabs are unreachable.
    //
    // It is short here because the controller knows the whole tab set from
    // registration. In the library the only element that can see the set is
    // dui-tabs-list, via slot.assignedElements() filtered by tag name — the
    // exact coupling this model removes.
    const forward = this.orientation === "vertical"
      ? "ArrowDown"
      : "ArrowRight";
    const back = this.orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

    let target: RegisteredTab | undefined;
    if (event.key === forward) target = this.#step(value, 1);
    else if (event.key === back) target = this.#step(value, -1);
    else if (event.key === "Home") target = this.#edge(1);
    else if (event.key === "End") target = this.#edge(-1);
    else return;

    if (!target) return;
    event.preventDefault();
    target.element.focus();
  };

  /** Next enabled tab in `direction`, wrapping, skipping disabled ones. */
  #step(from: string, direction: 1 | -1): RegisteredTab | undefined {
    const tabs = this.#tabs;
    const start = tabs.findIndex((t) => t.value === from);
    if (start < 0 || tabs.length === 0) return undefined;
    for (let i = 1; i <= tabs.length; i++) {
      const index = (start + direction * i + tabs.length * tabs.length) %
        tabs.length;
      const candidate = tabs[index];
      if (candidate && !candidate.disabled && candidate.value !== from) {
        return candidate;
      }
    }
    return undefined;
  }

  /** First (1) or last (-1) enabled tab. */
  #edge(direction: 1 | -1): RegisteredTab | undefined {
    const tabs = direction === 1 ? this.#tabs : [...this.#tabs].reverse();
    return tabs.find((t) => !t.disabled);
  }

  #requestUpdateEverywhere(): void {
    this.#host.requestUpdate();
    for (const part of this.#parts) part.requestUpdate();
  }
}
