import { css, unsafeCSS } from "lit";
import { DuiTreeItemPrimitive } from "@dui/primitives/tree";
import "../_install.ts";

// Lucide chevron-right, encoded for use as a CSS mask
const chevronMask = unsafeCSS(
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E")`,
);

// Lucide loader-2 (rotating arc), used as a spinner mask while loading
const spinnerMask = unsafeCSS(
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12a9 9 0 1 1-6.219-8.56'/%3E%3C/svg%3E")`,
);

const styles = css`
  /* ── Row container ─────────────────────────────────────────────────── */

  /*
  * IMPORTANT: All visual styling lives on [part="content"], NOT [part="root"].
  * [part="root"] wraps both the row and the children group, so :hover on it
  * would bleed onto descendant rows. See the hover-bleed regression demo.
  */
  [part="content"] {
    height: var(--dui-tree-row-height);
    padding-inline-start: calc(
      var(--_tree-row-px) +
        (var(--dui-tree-level, 1) - 1) * var(--dui-tree-indent)
      );
      padding-inline-end: var(--_tree-row-px);
      margin-block: calc(var(--dui-tree-row-spacing) / 2);
      margin-inline: var(--space-1);
      border-radius: var(--dui-tree-row-radius);
      gap: var(--_tree-inline-gap);
      color: var(--text-1);
      font-family: var(--font-sans);
      font-size: var(--_tree-label-font-size);
      line-height: var(--_tree-label-line-height);
      cursor: pointer;
      transition-property: background, box-shadow, color;
      transition-duration: var(--duration-faster);
      transition-timing-function: var(--ease-out-3);
      /* Allow children to truncate */
      min-width: 0;
    }

    @media (hover: hover) {
      [part="content"]:hover {
        background: var(--dui-tree-hover-bg);
      }
    }

    :host([data-selected]) [part="content"] {
      background: var(--dui-tree-selected-bg);
    }

    :host([data-disabled]) [part="content"] {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ── Focus ring ─────────────────────────────────────────────────────── */

    [part="root"]:focus-visible {
      outline: none;
    }

    [part="root"]:focus-visible [part="content"] {
      box-shadow:
        0 0 0 var(--focus-ring-offset) var(--background),
        0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width))
        var(--focus-ring-color);
      /* Keep the highlighted row above siblings so the ring isn't clipped. */
      position: relative;
      z-index: 1;
    }

    /* ── Indicator (chevron / spinner / leaf placeholder) ─────────────── */

    [part="indicator"] {
      width: var(--_tree-indicator-size);
      height: var(--_tree-indicator-size);
      color: var(--text-2);
    }

    /* Branch chevron */
    :host([data-branch]) [part="indicator"]::before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: currentColor;
      -webkit-mask: ${chevronMask} center / contain no-repeat;
      mask: ${chevronMask} center / contain no-repeat;
      transition-property: transform;
      transition-duration: var(--duration-fast);
      transition-timing-function: var(--ease-out-3);
    }

    :host([data-expanded]) [part="indicator"]::before {
      transform: rotate(90deg);
    }

    /* Loading spinner replaces the chevron in-place */
    :host([data-loading]) [part="indicator"]::before {
      -webkit-mask: ${spinnerMask} center / contain no-repeat;
      mask: ${spinnerMask} center / contain no-repeat;
      transform: none;
      animation: dui-tree-spin 0.9s linear infinite;
    }

    @keyframes dui-tree-spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* ── Slotted content ────────────────────────────────────────────────── */

    ::slotted([slot="label"]) {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    ::slotted([slot="end"]) {
      flex-shrink: 0;
      color: var(--text-2);
      font-size: var(--_tree-end-font-size);
      line-height: var(--_tree-end-line-height);
    }

    /* ── Reduced motion ────────────────────────────────────────────────── */

    @media (prefers-reduced-motion: reduce) {
      [part="content"],
      :host([data-branch]) [part="indicator"]::before {
        transition-duration: 0s;
      }
      :host([data-loading]) [part="indicator"]::before {
        animation: none;
      }
    }
  `;

  export class DuiTreeItem extends DuiTreeItemPrimitive {
    static override styles = [...DuiTreeItemPrimitive.styles, styles];
  }

  customElements.define(DuiTreeItem.tagName, DuiTreeItem);
