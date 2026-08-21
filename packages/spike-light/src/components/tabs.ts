/**
 * `bui-tabs` family (probe P7) — compound, light DOM, tabs as elements.
 *
 * bui:source @dui/components/tabs@2.4.0  bui:hash <recorded at copy>
 *
 *   <bui-tabs default-value="one">
 *     <bui-tabs-list>
 *       <bui-tab value="one">One</bui-tab>
 *       <bui-tab value="two">Two</bui-tab>
 *       <bui-tabs-indicator></bui-tabs-indicator>
 *     </bui-tabs-list>
 *     <bui-tabs-panel value="one">...</bui-tabs-panel>
 *     <bui-tabs-panel value="two">...</bui-tabs-panel>
 *   </bui-tabs>
 *
 * Every part is its own surface: `bui-tab` IS the tab (role="tab" on itself,
 * label is its consumer-authored children), the list IS the tablist, the
 * panel IS the tabpanel. Nothing here renders markup — this family is pure
 * `applyProps` + CSS, which is the degenerate (and most common) compound
 * case P7 wants CompoundController to make cheap.
 */
import { css, ReactiveElement } from "@lit/reactive-element";
import { TabsController } from "../controllers/tabs.ts";
import { applyProps } from "../core/spread.ts";
import { lightDom } from "../core/light-dom.ts";
import { attach } from "../core/lit.ts";
import { defineFamily } from "../core/define.ts";
import "../core/install.ts";

const styles = css`
  @layer bui.components {
    /* ── Root: layout + size cascade ── */

    bui-tabs {
      display: flex;
      flex-direction: column;
    }

    bui-tabs[data-orientation="vertical"] {
      flex-direction: row;
    }

    bui-tabs[controls="footer"] {
      flex-direction: column-reverse;
    }

    /* Sizes. bui-tab is a light-DOM descendant, so these inheritable vars
    * cascade to each tab. md is the implicit default (the fallback lives in
    * the bui-tab var() consumption). Per spec only the tab-trigger height +
    * font scale — the indicator stays fixed. */

    bui-tabs[size="xs"] {
      --tab-height: var(--component-height-xs);
      --tab-font-size: var(--text-xs);
      --tabs-indicator-radius: calc(var(--radius-md) * 0.8);
    }

    bui-tabs[size="sm"] {
      --tab-height: var(--component-height-sm);
      --tab-font-size: var(--text-xs);
    }

    bui-tabs[size="lg"] {
      --tab-height: var(--component-height-lg);
      --tab-font-size: var(--text-sm);
    }

    /* ── List ── */

    bui-tabs-list {
      --tabs-list-justify: start;

      display: flex;
      position: relative;
      z-index: 0;
      justify-content: var(--tabs-list-justify);
      padding-inline: 0;
      gap: 0;
    }

    bui-tabs-list[data-orientation="vertical"] {
      flex-direction: column;
      box-shadow: inset -1px 0 var(--border);
      padding-inline: 0;
      padding-block: var(--space-1);
    }

    /* ── Tab ── */

    bui-tab {
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      white-space: nowrap;
      word-break: keep-all;
      cursor: pointer;
      color: var(--text-2);
      font-size: var(--tab-font-size, var(--text-sm));
      line-height: var(--line-height-snug);
      font-weight: var(--font-weight-medium);
      padding-inline: var(--space-2);
      height: var(--tab-height, var(--component-height-md));
      transition-property: color, box-shadow, background, filter, transform;
      transition-duration: var(--duration-fast);
    }

    bui-tab[data-active] {
      color: var(--text-1);
    }

    @media (hover: hover) {
      bui-tab:hover:not([data-disabled]) {
        color: var(--text-1);
      }
    }

    bui-tab:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
        var(--focus-ring-color);
      border-radius: var(--radius-sm);
      z-index: 1;
    }

    bui-tab[data-disabled] {
      cursor: not-allowed;
      opacity: 0.4;
    }

    /* ── Indicator: driven by vars the controller sets on the list ── */

    bui-tabs-indicator {
      --tabs-indicator-bg: oklch(from var(--foreground) l c h / 0.08);
      --tabs-indicator-duration: var(--duration-normal);
      --tabs-indicator-easing: var(--ease-in-out-3);

      display: block;
      position: absolute;
      z-index: -1;
      left: 0;
      top: 50%;
      translate: var(--active-tab-left, 0) -50%;
      width: var(--active-tab-width, 0);
      height: 100%;
      pointer-events: none;
      border-radius: var(--tabs-indicator-radius, var(--radius-md));
      background: var(--tabs-indicator-bg);
      transition-property: translate, width;
      transition-duration: var(--tabs-indicator-duration);
      transition-timing-function: var(--tabs-indicator-easing);
    }

    /* ── Panel ── */

    bui-tabs-panel[data-hidden] {
      display: none;
    }

    bui-tabs-panel:not([data-hidden]) {
      --tabs-panel-padding: var(--space-3);
      --tabs-panel-border-width: var(--border-width-thin);
      --tabs-panel-border-color: var(--border);
      --tabs-panel-border-radius: var(--radius-md);
      --tabs-panel-background: none;

      display: block;
      position: relative;
      outline: 0;
      flex: 1;
      min-height: 0;
      padding: var(--tabs-panel-padding);
      border: var(--tabs-panel-border-width) solid
        var(--tabs-panel-border-color);
      border-radius: var(--tabs-panel-border-radius);
      background: var(--tabs-panel-background);
      transition-property: box-shadow;
      transition-duration: var(--duration-fast);
      font-family: var(--font-sans);
      font-size: var(--text-sm);
      line-height: var(--text-sm--line-height);
      font-weight: var(--font-weight-regular);
      color: var(--text-2);
    }

    bui-tabs-panel:focus-visible {
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
        var(--focus-ring-color);
      border-radius: var(--radius-md);
    }
  }
`;

// ---- Root -------------------------------------------------------------------

export class BuiTabs extends ReactiveElement {
  static tagName = "bui-tabs" as const;
  static override styles = styles;

  static override properties = {
    value: { type: String },
    defaultValue: { type: String, attribute: "default-value" },
    orientation: { type: String, reflect: true },
  };

  declare value: string | undefined;
  declare defaultValue: string | undefined;
  declare orientation: "horizontal" | "vertical";

  readonly tabs = attach(
    this,
    new TabsController({
      getValue: () => this.value,
      getDefaultValue: () => this.defaultValue,
      getOrientation: () => this.orientation,
      onChange: (value) => {
        if (this.value !== undefined) this.value = value;
        this.dispatchEvent(
          new CustomEvent("value-change", {
            detail: { value },
            bubbles: true,
            composed: true,
          }),
        );
      },
    }),
  );

  constructor() {
    super();
    this.orientation = "horizontal";
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    applyProps(this, this.tabs.rootProps);
  }
}

// ---- Parts ------------------------------------------------------------------

abstract class TabsPart extends ReactiveElement {
  protected root: BuiTabs | null = null;
  #unregister: (() => void) | null = null;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.root = this.closest<BuiTabs>("bui-tabs");
    if (!this.root) {
      console.warn(`[bui] <${this.tagName.toLowerCase()}> outside <bui-tabs>`);
      return;
    }
    this.#unregister = this.root.tabs.registerAux({
      element: this,
      requestUpdate: () => this.requestUpdate(),
    });
  }

  override disconnectedCallback(): void {
    this.#unregister?.();
    this.#unregister = null;
    super.disconnectedCallback();
  }
}

/** The tablist. Applies its bag to itself and re-measures the indicator. */
export class BuiTabsList extends TabsPart {
  static tagName = "bui-tabs-list" as const;

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.tabs.listProps);
  }

  protected override updated(): void {
    // After the tabs have laid out — same timing as the library's list.
    this.root?.tabs.measureIndicator();
  }
}

/** A tab: registers itself; its children are its label. */
export class BuiTab extends ReactiveElement {
  static tagName = "bui-tab" as const;

  static override properties = {
    value: { type: String },
    disabled: { type: Boolean, reflect: true },
  };

  declare value: string;
  declare disabled: boolean;

  #root: BuiTabs | null = null;
  #unregister: (() => void) | null = null;

  constructor() {
    super();
    this.value = "";
    this.disabled = false;
  }

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.#root = this.closest<BuiTabs>("bui-tabs");
    if (!this.#root) {
      console.warn("[bui] <bui-tab> outside <bui-tabs>");
      return;
    }
    this.#unregister = this.#root.tabs.register(
      { element: this, requestUpdate: () => this.requestUpdate() },
      {
        getValue: () => this.value,
        getDisabled: () => this.disabled,
      },
    );
  }

  override disconnectedCallback(): void {
    this.#unregister?.();
    this.#unregister = null;
    super.disconnectedCallback();
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (!this.#root) return;
    applyProps(
      this,
      this.#root.tabs.tabProps({
        element: this,
        requestUpdate: () => this.requestUpdate(),
      }),
    );
  }
}

/** The indicator. Pure CSS — positioned by vars the controller publishes. */
export class BuiTabsIndicator extends ReactiveElement {
  static tagName = "bui-tabs-indicator" as const;

  protected override createRenderRoot(): HTMLElement {
    return lightDom(this);
  }
}

/** A panel: hidden unless its value matches the active tab. */
export class BuiTabsPanel extends TabsPart {
  static tagName = "bui-tabs-panel" as const;

  static override properties = {
    value: { type: String },
  };

  declare value: string;

  constructor() {
    super();
    this.value = "";
  }

  protected override update(changed: Map<PropertyKey, unknown>): void {
    super.update(changed);
    if (this.root) applyProps(this, this.root.tabs.panelProps(this.value));
  }
}

export const tabsFamily = [
  BuiTabs,
  BuiTabsList,
  BuiTab,
  BuiTabsIndicator,
  BuiTabsPanel,
] as const;

defineFamily(tabsFamily);
