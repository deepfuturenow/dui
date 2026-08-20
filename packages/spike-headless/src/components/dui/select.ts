/**
 * `<dui-select-h>` — the whole select: markup, styles, and wiring, in one file
 * the app owns.
 *
 * Behavior is a dependency: `SelectController` holds state, keyboard handling,
 * ARIA values and positioning, and hands back prop bags to spread onto the
 * markup below. Nothing in the controller knows what these elements are called.
 *
 * ---------------------------------------------------------------------------
 * Copied from:  @dui/components@2.4.0  packages/components/src/select/select.ts
 * CSS block sha256 (first 16):  c0c9acf6ab21e49f
 * Structural CSS from:  @dui/primitives  select/select.ts  (hostStyles +
 *                       componentStyles), class names rewritten to this file's
 * ---------------------------------------------------------------------------
 * FINDINGS recommendation 5 says an eject should record where the copy came
 * from so a three-way diff is possible later. This is where that goes. A real
 * `dui add` would write and verify the hash; here it is pasted by hand.
 */
import { css, html, LitElement, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { base } from "@dui/core/base";
import { spread } from "../../spread.ts";
import {
  SelectController,
  type SelectOption,
} from "../../select-controller.ts";
import "./_install.ts";
// Leaf components stay ordinary dependencies. The previous spike copied these
// too, because it was copying "select and everything it touches". Here the
// subject is the template, and these are just elements the template renders.
import "@dui/components/icon";
import "@dui/components/scroll-area";

const styles = css`
  :host {
    display: block;
    /* Allow the select to shrink below its content's intrinsic width when it
      is a flex/grid item, so the .value's ellipsis truncation actually
      engages instead of the trigger pushing the surrounding layout wider. */
    min-width: 0;
  }

  .trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    user-select: none;
    box-sizing: border-box;
  }

  .trigger[data-disabled] {
    cursor: not-allowed;
  }

  .value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon {
    flex-shrink: 0;
  }

  .popup {
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

  .popup:popover-open {
    opacity: 1;
  }

  @starting-style {
    .popup:popover-open {
      opacity: 0;
    }
  }

  dui-scroll-area {
    max-height: var(--dui-available-height, 240px);
    height: auto;
  }

  .item {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .item[data-disabled] {
    cursor: not-allowed;
  }

  .indicator {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-text {
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

  :host {
    --select-item-font-size: var(--text-sm);
    --select-item-padding-y: var(--space-1_5);
    --select-item-icon-size: var(--space-3_5);
  }

  /* ---- CONSUMER CHANGE 3: count badge in the trigger ---- */
  .badge {
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
  :host([size="compact"]) {
    --select-item-font-size: var(--text-2xs);
    --select-item-padding-y: var(--space-0_5);
    --select-item-icon-size: var(--space-2_5);
  }

  :host([size="xs"]) {
    --select-item-font-size: var(--text-xs);
    --select-item-padding-y: var(--space-1);
    --select-item-icon-size: var(--space-3);
  }

  :host([size="sm"]) {
    --select-item-font-size: var(--text-xs);
    --select-item-padding-y: var(--space-1_5);
    --select-item-icon-size: var(--space-3_5);
  }

  :host([size="lg"]) {
    --select-item-font-size: var(--text-sm);
    --select-item-padding-y: var(--space-1_5);
    --select-item-icon-size: var(--space-4);
  }

  .trigger {
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

  .trigger:focus {
    outline: none;
  }

  .trigger:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
      var(--focus-ring-color);
  }

  :host([size="compact"]) .trigger {
    height: var(--component-height-xxs);
    gap: var(--space-1);
    padding: var(--space-0_5) var(--space-1_5) var(--space-0_5) var(--space-0_5);
    border-radius: calc(var(--radius-md) * 0.6);
    font-size: var(--text-2xs);
    line-height: var(--text-2xs--line-height);
  }

  :host([size="xs"]) .trigger {
    height: var(--component-height-xs);
    padding: var(--space-1) var(--space-2) var(--space-1) var(--space-1);
    border-radius: calc(var(--radius-md) * 0.8);
    font-size: var(--text-xs);
  }

  :host([size="sm"]) .trigger {
    height: var(--component-height-sm);
    padding: var(--space-1_5) var(--space-1_5) var(--space-1_5) var(--space-2_5);
    font-size: var(--text-xs);
  }

  :host([size="lg"]) .trigger {
    height: var(--component-height-lg);
    font-size: var(--text-sm);
  }

  .trigger:hover:not([data-disabled]) {
    background: oklch(from var(--foreground) l c h / 0.05);
  }

  .trigger:active:not([data-disabled]),
  .trigger[data-open]:not([data-disabled]) {
    background: oklch(from var(--foreground) l c h / 0.10);
  }

  .trigger[data-disabled] {
    opacity: 0.4;
  }

  :host([aria-invalid="true"]) .trigger {
    border-color: var(--destructive);
  }

  .value[data-placeholder] {
    color: var(--text-3);
  }

  .icon {
    display: flex;
    align-items: center;
    --icon-size: var(--space-4);
    color: var(--text-1);
  }

  :host([size="compact"]) .icon {
    --icon-size: var(--space-2_5);
  }

  :host([size="xs"]) .icon {
    --icon-size: var(--space-3);
  }

  :host([size="sm"]) .icon {
    --icon-size: var(--space-3_5);
  }

  :host([size="lg"]) .icon {
    --icon-size: var(--space-4);
  }

  /* ---- Popup (native top-layer [popover]) ---- */

  .popup {
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    max-width: 320px;
    transform: translateY(calc(var(--space-1) * -1));
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .popup:popover-open {
    transform: translateY(0);
  }

  @starting-style {
    .popup:popover-open {
      transform: translateY(calc(var(--space-1) * -1));
    }
  }

  /* When inner-aligned (macOS-style), appear/disappear instantly.
    transition: none  — avoids animation distorting getBoundingClientRect
                        while the alignInner middleware positions the popup.
    transform: none   — prevents a translateY flash at the aligned spot. */
  .popup[data-align-inner] {
    transform: none;
    transition: none;
  }

  .popup[data-align-inner]:popover-open {
    transform: none;
  }

  .listbox {
    padding: var(--space-1);
  }

  :host([size="compact"]) .listbox {
    padding: var(--space-0_5);
  }

  .item {
    gap: var(--space-2);
    padding: var(--select-item-padding-y) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--select-item-font-size);
    line-height: var(--line-height-snug);
    font-family: var(--font-sans);
    color: var(--text-1);
  }

  .item:hover,
  .item[data-highlighted] {
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  .item[data-selected] {
    font-weight: var(--font-weight-medium);
  }

  .item[data-disabled] {
    opacity: 0.4;
  }

  .indicator {
    width: var(--select-item-icon-size);
  }

  .indicator dui-icon {
    --icon-size: var(--select-item-icon-size);
  }
`;

export class DuiSelectH extends LitElement {
  static tagName = "dui-select-h" as const;
  static override styles = [base, styles];

  /**
   * Form association stays here rather than in the controller. `attachInternals()`
   * can only be called by the element itself, so a controller cannot own it —
   * it would have to be handed an `ElementInternals` the host already made.
   * Five lines in the owned file is cheaper than that indirection, and the owned
   * file is a real custom element, so this is its job. See FINDINGS.
   */
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

  /** Show a "position of total" badge in the trigger. */
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

  /**
   * The controller exposes `options`, `selectedOption`, `displayValue`,
   * `hasValue`, `highlightedIndex` and `isOpen` — but not `selectedIndex`, which
   * it keeps private for its own alignment maths. Recomputing it here from
   * public state is one line and needs nothing private, but the controller
   * should just expose it. See FINDINGS step 4, change 3.
   */
  get #selectedIndex(): number {
    return this.#select.options.findIndex((o) => o.value === this.value);
  }

  override render(): TemplateResult {
    const c = this.#select;

    return html`
      <div class="trigger" part="trigger" ${spread(c.triggerProps)}>
        <span class="icon">
          <dui-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round"
              stroke-linejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </dui-icon>
        </span>
        <span class="value" part="value" ${spread(c.valueProps)}>
          ${c.hasValue ? c.displayValue : this.placeholder}
        </span>
        ${this.badge && c.hasValue
          ? html`<span class="badge" part="badge">${
            this.#selectedIndex + 1
          }/${c.options.length}</span>`
          : nothing}
      </div>

      <div class="popup" part="popup" ${spread(c.popupProps)}>
        <dui-scroll-area ${spread(c.scrollerProps)}>
          <div class="listbox" part="listbox" ${spread(c.listboxProps)}>
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
    const isHighlighted = index === c.highlightedIndex;

    return html`
      <div
        class="item"
        part="${[
          "item",
          isSelected && "item-selected",
          isHighlighted && "item-highlighted",
          option.disabled && "item-disabled",
        ].filter(Boolean).join(" ")}"
        ${spread(c.itemProps(index))}
      >
        <span class="indicator" part="item-indicator">
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
        <span class="item-text" part="item-text" ${spread(
          c.itemTextProps,
        )}>${option.label}</span>
      </div>
    `;
  }
}

customElements.define(DuiSelectH.tagName, DuiSelectH);
