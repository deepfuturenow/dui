/**
 * The tabs family — five elements, their styles, and their wiring, in one file
 * the app owns.
 *
 * One file rather than five, matching the analogue: shadcn ships a single
 * `tabs.tsx` exporting Tabs, TabsList, TabsTrigger and TabsContent. The parts
 * are meaningless apart, and splitting them would put the composition contract
 * back into import paths.
 *
 * Behavior is a dependency: `TabsController` lives on the root element and is
 * handed to the parts through context. Each part spreads the bag it is given.
 *
 * ---------------------------------------------------------------------------
 * Copied from:  @dui/components@2.4.0  packages/components/src/tabs/*.ts
 *               @dui/primitives        tabs/*.ts (structural CSS)
 * Part selectors rewritten from [part="x"] to .x — this file owns its markup,
 * so it styles by class and publishes the same part names outward.
 * ---------------------------------------------------------------------------
 */
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property, state } from "lit/decorators.js";
import { consume, provide } from "@lit/context";
import { base } from "@dui/core/base";
import { spread } from "../../spread.ts";
import {
  TabsController,
  tabsControllerContext,
  type TabsOrientation,
} from "../../tabs-controller.ts";
import "./_install.ts";

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export class DuiTabsH extends LitElement {
  static tagName = "dui-tabs-h" as const;
  static override styles = [
    base,
    css`
      :host {
        display: block;
      }

      .root {
        display: flex;
        flex-direction: column;
      }

      .root[data-orientation="vertical"] {
        flex-direction: row;
      }

      :host([controls="footer"]) .root {
        flex-direction: column-reverse;
      }

      /* ---------------------------------------------------------------
      * Sizes. <dui-tab> is a light-DOM child, so these inheritable vars
      * cascade into each tab's shadow root. md is the implicit default
      * (the fallback lives in tab.ts's var() consumption). Per spec only
      * the tab-trigger height + font scale — the indicator stays fixed.
      * --------------------------------------------------------------- */

      :host([size="xs"]) {
        --tab-height: var(--component-height-xs);
        --tab-font-size: var(--text-xs);
        --tabs-indicator-radius: calc(var(--radius-md) * 0.8);
      }

      :host([size="sm"]) {
        --tab-height: var(--component-height-sm);
        --tab-font-size: var(--text-xs);
      }

      :host([size="lg"]) {
        --tab-height: var(--component-height-lg);
        --tab-font-size: var(--text-sm);
      }
    `,
  ];

  @property()
  accessor value: string | undefined = undefined;

  @property({ attribute: "default-value" })
  accessor defaultValue: string | undefined = undefined;

  @property({ reflect: true })
  accessor orientation: TabsOrientation = "horizontal";

  @property({ reflect: true })
  accessor controls: "header" | "footer" = "header";

  /**
   * The controller instance IS the context payload. Parts consume it and pull
   * their own prop bags, so all the coordination logic stays in one place
   * instead of being spread across five element classes.
   */
  @provide({ context: tabsControllerContext })
  accessor tabs: TabsController = new TabsController(this, {
    getValue: () => this.value,
    getDefaultValue: () => this.defaultValue,
    getOrientation: () => this.orientation,
    onChange: (value) => {
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: value,
          bubbles: true,
          composed: true,
        }),
      );
    },
  });

  override render(): TemplateResult {
    return html`
      <div class="root" part="root" ${spread(this.tabs.rootProps)}>
        <slot></slot>
      </div>
    `;
  }
}

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export class DuiTabsListH extends LitElement {
  static tagName = "dui-tabs-list-h" as const;
  static override styles = [
    base,
    css`
      :host {
        display: block;
      }

      .list {
        display: flex;
        position: relative;
        z-index: 0;
      }

      .list[data-orientation="vertical"] {
        flex-direction: column;
      }

      :host {
        --tabs-list-justify: start;
      }

      .list {
        justify-content: var(--tabs-list-justify);
        padding-inline: 0;
        gap: 0;
      }

      .list[data-orientation="vertical"] {
        box-shadow: inset -1px 0 var(--border);
        padding-inline: 0;
        padding-block: var(--space-1);
      }
    `,
  ];

  @consume({ context: tabsControllerContext, subscribe: true })
  accessor tabs!: TabsController;

  #unregister: (() => void) | undefined;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#unregister?.();
    this.#unregister = undefined;
  }

  protected override willUpdate(): void {
    if (this.tabs && !this.#unregister) {
      this.#unregister = this.tabs.registerPart(this);
    }
  }

  /**
   * The indicator has to be measured after the tabs have laid out. The root's
   * `updateComplete` does not await its light-DOM children, so the measurement
   * is driven from here — the same place and timing the library uses.
   */
  protected override updated(): void {
    this.tabs?.measureIndicator();
  }

  override render(): TemplateResult {
    return html`
      <div class="list" part="list" ${spread(this.tabs?.listProps ?? {})}>
        <slot></slot>
      </div>
    `;
  }
}

// ---------------------------------------------------------------------------
// Tab
// ---------------------------------------------------------------------------

export class DuiTabH extends LitElement {
  static tagName = "dui-tab-h" as const;

  /**
   * The controller moves focus by calling `focus()` on this host, because the
   * host element is all it has — the button is inside a shadow root the
   * controller knows nothing about. `delegatesFocus` forwards that to the
   * button. One more thing the consumer has to get right.
   */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  static override styles = [
    base,
    css`
      :host {
        display: block;
      }

      .tab {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 0;
        margin: 0;
        outline: 0;
        background: none;
        appearance: none;
        font-family: inherit;
        user-select: none;
        white-space: nowrap;
        word-break: keep-all;
        cursor: pointer;
      }

      .tab[data-disabled] {
        cursor: not-allowed;
      }

      /* Height + font-size read inheritable vars set by <dui-tabs size=…>.
      * The md defaults live in the var() fallbacks (NOT a :host declaration
      * here, which would shadow the value inherited from the container). */
      .tab {
        color: var(--text-2);
        font-size: var(--tab-font-size, var(--text-sm));
        line-height: var(--line-height-snug);
        font-weight: var(--font-weight-medium);
        padding-inline: var(--space-2);
        height: var(--tab-height, var(--component-height-md));
        transition-property: color, box-shadow, background, filter, transform;
        transition-duration: var(--duration-fast);
      }

      .tab[data-active] {
        color: var(--text-1);
      }

      @media (hover: hover) {
        .tab:hover:not([data-disabled]) {
          color: var(--text-1);
        }
      }

      .tab:focus-visible {
        box-shadow:
          0 0 0 var(--focus-ring-offset) var(--background),
          0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
          var(--focus-ring-color);
        border-radius: var(--radius-sm);
        z-index: 1;
      }

      .tab[data-disabled] {
        opacity: 0.4;
      }
    `,
  ];

  @property()
  accessor value = "";

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @consume({ context: tabsControllerContext, subscribe: true })
  accessor tabs!: TabsController;

  #unregister: (() => void) | undefined;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#unregister?.();
    this.#unregister = undefined;
  }

  /**
   * Registration, the price of a compound controller.
   *
   * The controller cannot find these elements: they are consumer-authored, in
   * light DOM, and named whatever this file names them. So each tab announces
   * itself. The library instead does `slot.assignedElements()` filtered by
   * `el.tagName === "DUI-TAB"`, which is a tag name hardcoded into the
   * behaviour layer and breaks the moment an app owns its own file.
   */
  protected override willUpdate(): void {
    if (!this.tabs) return;
    if (this.#unregister) {
      this.tabs.updateTab(this, this.value, this.disabled);
    } else {
      this.#unregister = this.tabs.registerTab(this, this.value, this.disabled);
    }
  }

  override render(): TemplateResult {
    return html`
      <button
        class="tab"
        part="tab"
        ${spread(this.tabs?.tabProps(this.value, this.disabled) ?? {})}
      ><slot></slot></button>
    `;
  }
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

export class DuiTabsPanelH extends LitElement {
  static tagName = "dui-tabs-panel-h" as const;
  static override styles = [
    base,
    css`
      :host {
        display: block;
      }

      .wrapper {
        display: contents;
      }

      .wrapper[hidden] {
        display: none;
      }

      .panel {
        position: relative;
        outline: 0;
      }

      :host {
        --tabs-panel-padding: var(--space-3);
        --tabs-panel-border-width: var(--border-width-thin);
        --tabs-panel-border-color: var(--border);
        --tabs-panel-border-radius: var(--radius-md);
        --tabs-panel-background: none;
      }

      :host(:not([data-hidden])) {
        flex: 1;
        min-height: 0;
        padding: var(--tabs-panel-padding);
        border: var(--tabs-panel-border-width) solid var(--tabs-panel-border-color);
        border-radius: var(--tabs-panel-border-radius);
        background: var(--tabs-panel-background);
      }

      .panel {
        transition-property: box-shadow;
        transition-duration: var(--duration-fast);
        font-family: var(--font-sans);
        font-size: var(--text-sm);
        line-height: var(--text-sm--line-height);
        font-weight: var(--font-weight-regular);
        color: var(--text-2);
      }

      .panel:focus-visible {
        box-shadow:
          0 0 0 var(--focus-ring-offset) var(--background),
          0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
          var(--focus-ring-color);
        border-radius: var(--radius-md);
      }
    `,
  ];

  @property()
  accessor value = "";

  @property({ type: Boolean, attribute: "keep-mounted" })
  accessor keepMounted = false;

  @consume({ context: tabsControllerContext, subscribe: true })
  accessor tabs!: TabsController;

  #unregister: (() => void) | undefined;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#unregister?.();
    this.#unregister = undefined;
  }

  /**
   * `data-hidden` goes on the host, not on an element in the template, because
   * the styled CSS keys off `:host(:not([data-hidden]))`. A prop bag cannot
   * reach the host — bags are spread onto elements — so this stays here. Four
   * lines, and it belongs to the owned file anyway.
   */
  override willUpdate(): void {
    if (this.tabs && !this.#unregister) {
      this.#unregister = this.tabs.registerPart(this);
    }
    if (this.tabs?.isActive(this.value)) this.removeAttribute("data-hidden");
    else this.setAttribute("data-hidden", "");
  }

  override render(): TemplateResult {
    const active = this.tabs?.isActive(this.value) ?? false;

    return html`<div class="wrapper" ?hidden=${!active}>
      ${
      active || this.keepMounted
        ? html`
          <div class="panel" part="panel" ${spread(
            this.tabs.panelProps(this.value),
          )}>
            <slot></slot>
          </div>
        `
        : nothing
    }
    </div>`;
  }
}

// ---------------------------------------------------------------------------
// Indicator
// ---------------------------------------------------------------------------

export class DuiTabsIndicatorH extends LitElement {
  static tagName = "dui-tabs-indicator-h" as const;
  static override styles = [
    base,
    css`
      :host {
        display: block;
        position: absolute;
        z-index: -1;
        left: 0;
        top: 50%;
        translate: var(--active-tab-left, 0) -50%;
        width: var(--active-tab-width, 0);
        pointer-events: none;
        transition-property: translate, width;
      }

      :host {
        --tabs-indicator-bg: oklch(from var(--foreground) l c h / 0.08);
        --tabs-indicator-duration: var(--duration-normal);
        --tabs-indicator-easing: var(--ease-in-out-3);

        height: 100%;
        /* md default; <dui-tabs size="xs"> tightens this via the inheritable var.
        * Consumed with a fallback (not declared on :host) so the size cascade
        * from the container isn't shadowed. */
        border-radius: var(--tabs-indicator-radius, var(--radius-md));
        background: var(--tabs-indicator-bg);
        transition-duration: var(--tabs-indicator-duration);
        transition-timing-function: var(--tabs-indicator-easing);
      }
    `,
  ];

  // Purely presentational. It consumes no context: the list publishes
  // --active-tab-left / --active-tab-width and this element rides them.
  override render(): TemplateResult {
    return html`<span part="indicator"></span>`;
  }
}

customElements.define(DuiTabsH.tagName, DuiTabsH);
customElements.define(DuiTabsListH.tagName, DuiTabsListH);
customElements.define(DuiTabH.tagName, DuiTabH);
customElements.define(DuiTabsPanelH.tagName, DuiTabsPanelH);
customElements.define(DuiTabsIndicatorH.tagName, DuiTabsIndicatorH);
