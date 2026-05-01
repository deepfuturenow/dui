import { css } from "lit";
import { DuiTreePrimitive } from "@dui/primitives/tree";
import "../_install.ts";

const styles = css`
  /* ── Sizes — write to public tokens on :host so consumer overrides win ── */

  :host {
    /* Default = sm */
    --dui-tree-row-height: var(--component-height-sm);
    --dui-tree-indent: var(--space-4);
    --dui-tree-row-spacing: 0;
    --dui-tree-row-radius: var(--radius-sm);
    --dui-tree-hover-bg: oklch(from var(--foreground) l c h / 0.05);
    --dui-tree-selected-bg: oklch(from var(--foreground) l c h / 0.10);

    /* Internal-only (not part of public token surface) */
    --_tree-label-font-size: var(--text-xs);
    --_tree-label-line-height: var(--text-xs--line-height);
    --_tree-end-font-size: var(--text-2xs);
    --_tree-end-line-height: var(--text-2xs--line-height);
    --_tree-indicator-size: 14px;
    --_tree-row-px: var(--space-2);
    --_tree-inline-gap: var(--space-2);
  }

  :host([size="md"]) {
    --dui-tree-row-height: var(--component-height-md);
    --dui-tree-indent: var(--space-5);
    --_tree-label-font-size: var(--text-sm);
    --_tree-label-line-height: var(--text-sm--line-height);
    --_tree-end-font-size: var(--text-xs);
    --_tree-end-line-height: var(--text-xs--line-height);
    --_tree-indicator-size: var(--space-4);
    --_tree-inline-gap: var(--space-2);
  }

  :host([size="lg"]) {
    --dui-tree-row-height: var(--component-height-lg);
    --dui-tree-indent: var(--space-6);
    --_tree-label-font-size: var(--text-sm);
    --_tree-label-line-height: var(--text-sm--line-height);
    --_tree-end-font-size: var(--text-xs);
    --_tree-end-line-height: var(--text-xs--line-height);
    --_tree-indicator-size: var(--space-4);
    --_tree-inline-gap: var(--space-2_5);
  }
`;

export class DuiTree extends DuiTreePrimitive {
  static override styles = [...DuiTreePrimitive.styles, styles];
}

customElements.define(DuiTree.tagName, DuiTree);
