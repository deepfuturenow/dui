/**
 * `<dui-select-l>` — the same owned select, rendered into the LIGHT DOM.
 *
 * Step 3 of the four-step plan: does dropping shadow DOM make the owned-file
 * model better? Same controller, same spread directive, same markup. The only
 * differences are where the element renders and how its styles get applied.
 *
 * What changed, and nothing else did:
 *
 *   1. `createRenderRoot()` returns `this`, so Lit renders into the element.
 *   2. `static styles` does nothing without a shadow root. The stylesheet is
 *      adopted into the document once, at module scope, with every selector
 *      prefixed by the tag name. That prefixing was fully mechanical: 51
 *      selector lines, `:host` -> `dui-select-l`, everything else -> descendant.
 *      Zero needed hand editing.
 *   3. `part=` attributes are gone. They do nothing outside a shadow root —
 *      which is the point: a consumer writes `dui-select-l .trigger` instead of
 *      `::part(trigger)`, so there is no export ceremony and nothing to publish.
 *   4. The shared `base` reset could not come along. It contains
 *      `* { box-sizing: border-box }`, and adopting that into the document from
 *      a component would be an unacceptable side effect. A scoped equivalent is
 *      at the top of the stylesheet instead. See FINDINGS.
 */
import { html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { spread } from "../../spread.ts";
import {
  SelectController,
  type SelectOption,
} from "../../select-controller.ts";
import "./_install.ts";
import "@dui/components/icon";
import "@dui/components/scroll-area";

/**
 * Adopted once, at module scope. In the shadow-DOM version Lit handles this per
 * shadow root; here the component has to do it itself, and has to make sure it
 * happens exactly once no matter how many instances exist.
 */
const sheet = new CSSStyleSheet();
sheet.replaceSync(`
  /* Scoped stand-in for the shared base reset, which cannot be adopted
     document-wide from inside a component. */
  dui-select-l,
  dui-select-l * {
    box-sizing: border-box;
  }
  dui-select-l {
    display: block;
    /* Allow the select to shrink below its content's intrinsic width when it
      is a flex/grid item, so the .value's ellipsis truncation actually
      engages instead of the trigger pushing the surrounding layout wider. */
    min-width: 0;
  }

  dui-select-l .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
  }

  dui-select-l .trigger[data-disabled] {
    cursor: not-allowed;
  }

  dui-select-l .value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  dui-select-l .icon {
    flex-shrink: 0;
  }

  dui-select-l .popup {
    /* Reset UA [popover] defaults so Floating UI's left/top win. */
    position: fixed;
    inset: auto;
    margin: 0;
    border: none;
    /* The UA [popover] sheet supplies 0.25em of padding. Reset it: the inner
      dui-scroll-area is capped at the same --dui-available-height as the
      popup, so any padding here is added on top and pushes the popup that
      much past the viewport edge — and makes the popup scroll a few px too,
      fighting the scroll-area. */
    padding: 0;
    /* The inner dui-scroll-area owns scrolling. These two are the fallback for
      when dui-scroll-area is not registered: the un-upgraded element stays
      display:inline and ignores max-height, so without them a long list would
      overflow the popup entirely. */
    max-height: var(--dui-available-height, 240px);
    overflow-y: auto;
    overscroll-behavior: contain;
    opacity: 0;
    transition-property: opacity, transform, overlay, display;
    transition-behavior: allow-discrete;
  }

  dui-select-l .popup:popover-open {
    opacity: 1;
  }

  @starting-style {
    dui-select-l .popup:popover-open {
      opacity: 0;
    }
  }

  dui-select-l dui-scroll-area {
    max-height: var(--dui-available-height, 240px);
    height: auto;
  }

  dui-select-l .item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  dui-select-l .item[data-disabled] {
    cursor: not-allowed;
  }

  dui-select-l .indicator {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  dui-select-l .item-text {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ---------------------------------------------------------------
  * Size tokens. The popup now renders in this same shadow root (native
  * top-layer [popover]), so the --select-item-* vars set on the host
  * inherit to the option rows directly — no forwarding needed.
  * --------------------------------------------------------------- */

  dui-select-l {
    --select-item-font-size: var(--text-sm);
    --select-item-padding-y: var(--space-1_5);
    --select-item-icon-size: var(--space-3_5);
  }

  /* ---- CONSUMER CHANGE 3: count badge in the trigger ---- */
  dui-select-l .badge {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    padding: 0 var(--space-1_5);
    height: var(--space-4);
    border-radius: var(--radius-full);
    background: oklch(from var(--foreground) l c h / 0.08);
    color: var(--text-2);
    font-size: var(--text-2xs);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  /* ---- CONSUMER CHANGE 1: size="compact" ---- */
  dui-select-l[size="compact"] {
    --select-item-font-size: var(--text-2xs);
    --select-item-padding-y: var(--space-0_5);
    --select-item-icon-size: var(--space-2_5);
  }

  dui-select-l[size="xs"] {
    --select-item-font-size: var(--text-xs);
    --select-item-padding-y: var(--space-1);
    --select-item-icon-size: var(--space-3);
  }

  dui-select-l[size="sm"] {
    --select-item-font-size: var(--text-xs);
    --select-item-padding-y: var(--space-1_5);
    --select-item-icon-size: var(--space-3_5);
  }

  dui-select-l[size="lg"] {
    --select-item-font-size: var(--text-sm);
    --select-item-padding-y: var(--space-1_5);
    --select-item-icon-size: var(--space-4);
  }

  dui-select-l .trigger {
    height: var(--component-height-md);
    gap: var(--space-2);
    /* CONSUMER CHANGE 2: was 2/2/2/3, flipped now the icon leads. */
    padding: var(--space-2) var(--space-3) var(--space-2) var(--space-2);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    transition-property: border-color, box-shadow, background, filter, transform;
    transition-duration: var(--duration-fastest);
  }

  dui-select-l .trigger:focus {
    outline: none;
  }

  dui-select-l .trigger:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
      var(--focus-ring-color);
  }

  dui-select-l[size="compact"] .trigger {
    height: var(--component-height-xxs);
    gap: var(--space-1);
    padding: var(--space-0_5) var(--space-1_5) var(--space-0_5) var(--space-0_5);
    border-radius: calc(var(--radius-md) * 0.6);
    font-size: var(--text-2xs);
    line-height: var(--text-2xs--line-height);
  }

  dui-select-l[size="xs"] .trigger {
    height: var(--component-height-xs);
    padding: var(--space-1) var(--space-2) var(--space-1) var(--space-1);
    border-radius: calc(var(--radius-md) * 0.8);
    font-size: var(--text-xs);
  }

  dui-select-l[size="sm"] .trigger {
    height: var(--component-height-sm);
    padding: var(--space-1_5) var(--space-1_5) var(--space-1_5) var(--space-2_5);
    font-size: var(--text-xs);
  }

  dui-select-l[size="lg"] .trigger {
    height: var(--component-height-lg);
    font-size: var(--text-sm);
  }

  dui-select-l .trigger:hover:not([data-disabled]) {
    background: oklch(from var(--foreground) l c h / 0.05);
  }

  dui-select-l .trigger:active:not([data-disabled]),
  dui-select-l .trigger[data-open]:not([data-disabled]) {
    background: oklch(from var(--foreground) l c h / 0.10);
  }

  dui-select-l .trigger[data-disabled] {
    opacity: 0.4;
  }

  dui-select-l[aria-invalid="true"] .trigger {
    border-color: var(--destructive);
  }

  dui-select-l .value[data-placeholder] {
    color: var(--text-3);
  }

  dui-select-l .icon {
    display: flex;
    align-items: center;
    --icon-size: var(--space-4);
    color: var(--text-1);
  }

  dui-select-l[size="compact"] .icon {
    --icon-size: var(--space-2_5);
  }

  dui-select-l[size="xs"] .icon {
    --icon-size: var(--space-3);
  }

  dui-select-l[size="sm"] .icon {
    --icon-size: var(--space-3_5);
  }

  dui-select-l[size="lg"] .icon {
    --icon-size: var(--space-4);
  }

  /* ---- Popup (native top-layer [popover]) ---- */

  dui-select-l .popup {
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    max-width: 320px;
    transform: translateY(calc(var(--space-1) * -1));
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  dui-select-l .popup:popover-open {
    transform: translateY(0);
  }

  @starting-style {
    dui-select-l .popup:popover-open {
      transform: translateY(calc(var(--space-1) * -1));
    }
  }

  /* When inner-aligned (macOS-style), appear/disappear instantly.
    transition: none  — avoids animation distorting getBoundingClientRect
                        while the alignInner middleware positions the popup.
    transform: none   — prevents a translateY flash at the aligned spot. */
  dui-select-l .popup[data-align-inner] {
    transform: none;
    transition: none;
  }

  dui-select-l .popup[data-align-inner]:popover-open {
    transform: none;
  }

  dui-select-l .listbox {
    padding: var(--space-1);
  }

  dui-select-l[size="compact"] .listbox {
    padding: var(--space-0_5);
  }

  dui-select-l .item {
    gap: var(--space-2);
    padding: var(--select-item-padding-y) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--select-item-font-size);
    line-height: var(--line-height-snug);
    font-family: var(--font-sans);
    color: var(--text-1);
  }

  dui-select-l .item:hover,
  dui-select-l .item[data-highlighted] {
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  dui-select-l .item[data-selected] {
    font-weight: var(--font-weight-medium);
  }

  dui-select-l .item[data-disabled] {
    opacity: 0.4;
  }

  dui-select-l .indicator {
    width: var(--select-item-icon-size);
  }

  dui-select-l .indicator dui-icon {
    --icon-size: var(--select-item-icon-size);
  }`);

if (!document.adoptedStyleSheets.includes(sheet)) {
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
}

export class DuiSelectL extends LitElement {
  static tagName = "dui-select-l" as const;

  /** Render into the light DOM. Everything below is now ordinary page CSS. */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }

  static formAssociated = true;
  #internals: ElementInternals = this.attachInternals();

  override willUpdate(): void {
    this.#internals.setFormValue(this.value);
  }

  @property({ attribute: false })
  accessor options: SelectOption[] = [];

  @property({ type: String })
  accessor value = "";

  @property({ type: String })
  accessor placeholder = "Select...";

  @property({ type: Boolean, reflect: true })
  accessor disabled = false;

  @property({
    type: Boolean,
    attribute: "align-item-to-trigger",
    reflect: true,
  })
  accessor alignItemToTrigger = true;

  @property({ type: String })
  accessor name = "";

  @property({ type: Boolean, reflect: true })
  accessor badge = false;

  #select = new SelectController(this, {
    getOptions: () => this.options,
    getValue: () => this.value,
    getPlaceholder: () => this.placeholder,
    getDisabled: () => this.disabled,
    getAlignItemToTrigger: () => this.alignItemToTrigger,
    onChange: (value, option) => {
      this.value = value;
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: { value, option },
          bubbles: true,
          composed: true,
        }),
      );
    },
  });

  get #selectedIndex(): number {
    return this.#select.options.findIndex((o) => o.value === this.value);
  }

  override render(): TemplateResult {
    const c = this.#select;

    return html`
      <div class="trigger" ${spread(c.triggerProps)}>
        <span class="icon">
          <dui-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </dui-icon>
        </span>
        <span class="value" ${spread(c.valueProps)}>
          ${c.hasValue ? c.displayValue : this.placeholder}
        </span>
        ${this.badge && c.hasValue
          ? html`<span class="badge">${
            this.#selectedIndex + 1
          }/${c.options.length}</span>`
          : nothing}
      </div>

      <div class="popup" ${spread(c.popupProps)}>
        <dui-scroll-area ${spread(c.scrollerProps)}>
          <div class="listbox" ${spread(c.listboxProps)}>
            ${repeat(
              c.options,
              (option) => option.value,
              (option, index) => this.#renderItem(option, index),
            )}
          </div>
        </dui-scroll-area>
      </div>
    `;
  }

  #renderItem(option: SelectOption, index: number): TemplateResult {
    const c = this.#select;
    const isSelected = option.value === this.value;

    return html`
      <div class="item" ${spread(c.itemProps(index))}>
        <span class="indicator">
          ${isSelected
            ? html`
              <dui-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </dui-icon>
            `
            : nothing}
        </span>
        <span class="item-text" ${spread(c.itemTextProps)}>${option
          .label}</span>
      </div>
    `;
  }
}

customElements.define(DuiSelectL.tagName, DuiSelectL);
