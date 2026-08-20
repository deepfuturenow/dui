/**
 * Ejected from `@dui/components/select` — this file is now owned by the app.
 *
 * Behavior stays a dependency: `DuiSelectPrimitive` (from `@dui/primitives`)
 * owns the render tree, keyboard model, floating/top-layer positioning and
 * form association. Everything below is aesthetics.
 *
 * Step 2 of the spike: the CSS is a verbatim copy of the library's styled
 * select, so the ejected element renders identically before any modification.
 */
import { css } from "lit";
import { DuiSelectPrimitive } from "@dui/primitives/select";
import "./_install.ts";
// The primitive renders `<dui-icon>` and `<dui-scroll-area>` by tag name inside
// its own template. Neither is a slot, neither is injectable — if they are not
// registered the popup and the chevron silently degrade. Ejecting select
// therefore means registering these two as well.
import "./icon.ts";
import "./scroll-area.ts";

const styles = css`
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

  .Trigger {
    height: var(--component-height-md);
    gap: var(--space-2);
    padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    transition-property: border-color, box-shadow, background, filter, transform;
    transition-duration: var(--duration-fastest);
  }

  .Trigger:focus {
    outline: none;
  }

  .Trigger:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }

  :host([size="xs"]) .Trigger {
    height: var(--component-height-xs);
    padding: var(--space-1) var(--space-1) var(--space-1) var(--space-2);
    border-radius: calc(var(--radius-md) * 0.8);
    font-size: var(--text-xs);
  }

  :host([size="sm"]) .Trigger {
    height: var(--component-height-sm);
    padding: var(--space-1_5) var(--space-1_5) var(--space-1_5) var(--space-2_5);
    font-size: var(--text-xs);
  }

  :host([size="lg"]) .Trigger {
    height: var(--component-height-lg);
    font-size: var(--text-sm);
  }

  .Trigger:hover:not([data-disabled]) {
    background: oklch(from var(--foreground) l c h / 0.05);
  }

  .Trigger:active:not([data-disabled]),
  .Trigger[data-open]:not([data-disabled]) {
    background: oklch(from var(--foreground) l c h / 0.10);
  }

  .Trigger[data-disabled] {
    opacity: 0.4;
  }

  :host([aria-invalid="true"]) .Trigger {
    border-color: var(--destructive);
  }

  .Value[data-placeholder] {
    color: var(--text-3);
  }

  .Icon {
    display: flex;
    align-items: center;
    --icon-size: var(--space-4);
    color: var(--text-1);
  }

  :host([size="xs"]) .Icon {
    --icon-size: var(--space-3);
  }

  :host([size="sm"]) .Icon {
    --icon-size: var(--space-3_5);
  }

  :host([size="lg"]) .Icon {
    --icon-size: var(--space-4);
  }

  /* ---- Popup (native top-layer [popover]) ---- */

  .Popup {
    background: var(--surface-3);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    max-width: 320px;
    transform: translateY(calc(var(--space-1) * -1));
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  .Popup:popover-open {
    transform: translateY(0);
  }

  @starting-style {
    .Popup:popover-open {
      transform: translateY(calc(var(--space-1) * -1));
    }
  }

  /* When inner-aligned (macOS-style), appear/disappear instantly.
     transition: none  — avoids animation distorting getBoundingClientRect
                         while the alignInner middleware positions the popup.
     transform: none   — prevents a translateY flash at the aligned spot. */
  .Popup[data-align-inner] {
    transform: none;
    transition: none;
  }

  .Popup[data-align-inner]:popover-open {
    transform: none;
  }

  .Listbox {
    padding: var(--space-1);
  }

  .Item {
    gap: var(--space-2);
    padding: var(--select-item-padding-y) var(--space-2);
    border-radius: var(--radius-sm);
    font-size: var(--select-item-font-size);
    line-height: var(--line-height-snug);
    font-family: var(--font-sans);
    color: var(--text-1);
  }

  .Item:hover,
  .Item[data-highlighted] {
    background: oklch(from var(--foreground) l c h / 0.05);
    color: var(--text-1);
  }

  .Item[data-selected] {
    font-weight: var(--font-weight-medium);
  }

  .Item[data-disabled] {
    opacity: 0.4;
  }

  .ItemIndicator {
    width: var(--select-item-icon-size);
  }

  .ItemIndicator dui-icon {
    --icon-size: var(--select-item-icon-size);
  }
`;

export class DuiSelect extends DuiSelectPrimitive {
  static override styles = [...DuiSelectPrimitive.styles, styles];
}

customElements.define(DuiSelect.tagName, DuiSelect);
