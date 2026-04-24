import { css, unsafeCSS } from "lit";

// Chevron-down SVG encoded for use as a CSS mask
const chevronMask = unsafeCSS(`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`);

const styles = css`
  /* ── Item ── */

  [part="item"] {
    border-bottom: var(
      --accordion-item-border,
      var(--border-width-thin) solid var(--border)
    );
  }

  /* ── Trigger ── */

  [part="trigger"] {
    gap: var(--space-4);
    padding-block: var(--space-2);
    padding-inline: 0;
    color: var(--text-1);
    font-family: var(--font-sans);
    font-weight: var(--font-weight-semibold);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    text-box: trim-both cap alphabetic;
    height: var(--component-height-md);
    border-radius: var(--radius-sm);
    transition-property: background, box-shadow, filter, transform;
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  @media (hover: hover) {
    [part="trigger"]:hover {
      background: oklch(from var(--foreground) l c h / 0.05);
    }
  }

  [part="trigger"]:focus-visible {
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
    z-index: 1;
  }

  [part="trigger"][data-disabled] {
    opacity: 0.4;
  }

  /* ── Indicator (theme-owned) ── */

  [part="trigger"]::after {
    content: "";
    display: var(--collapsible-indicator-display, block);
    width: var(--space-4);
    height: var(--space-4);
    flex-shrink: 0;
    background: currentColor;
    -webkit-mask: ${chevronMask} center / contain no-repeat;
    mask: ${chevronMask} center / contain no-repeat;
    transition-property: transform;
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  [part="trigger"][data-open]::after {
    transform: rotate(180deg);
  }

  /* ── Panel ── */

  [part="panel"] {
    transition-duration: var(--duration-fast);
    transition-timing-function: var(--ease-out-3);
  }

  [part="panel"][data-starting-style],
  [part="panel"][data-ending-style] {
    height: 0;
  }

  [part="content"] {
    padding: var(--space-1_5) 0 var(--space-4);
    font-family: var(--font-sans);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    font-weight: var(--font-weight-regular);
    color: var(--text-2);
    text-box: trim-both cap alphabetic;
  }

  /* ── Reduced motion ── */

  @media (prefers-reduced-motion: reduce) {
    [part="trigger"],
    [part="trigger"]::after,
    [part="panel"] {
      transition-duration: 0s;
    }
  }
`;


import { DuiAccordionItemPrimitive } from "@dui/primitives/accordion";
import "../_install.ts";

export class DuiAccordionItem extends DuiAccordionItemPrimitive {
  static override styles = [...DuiAccordionItemPrimitive.styles, styles];
}

customElements.define(DuiAccordionItem.tagName, DuiAccordionItem);
