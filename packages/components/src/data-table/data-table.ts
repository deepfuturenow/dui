import { css } from "lit";
import { DuiDataTablePrimitive } from "@dui/primitives/data-table";
import "../_install.ts";
// The selection column renders <dui-checkbox>; register the styled checkbox so
// it upgrades to this repo's look and behavior (mirrors toast → spinner).
import "../checkbox/index.ts";

const styles = css`
  :host {
    /* Selected-row tint — a subtle accent wash, matching this system's
      "selected" convention (see calendar's data-today). Consumers can
      override this property; :host lets an outer rule win over it. */
    --data-table-selected-background: var(--accent-subtle);

    /* Density. Inline padding is deliberately one property shared by both
      th and td: giving them separate knobs invites setting only one, which
      misaligns every column against its own header. Block padding is body-
      only, because header height is set outright rather than derived from
      padding — see --data-table-header-height. */
    --data-table-cell-padding-inline: var(--space-3);
    --data-table-cell-padding-block: var(--space-2);
    --data-table-header-height: var(--component-height-lg);
    /* The checkbox column is sized by the primitive's width: 1%, so it takes
      tighter inline padding than a content cell to avoid reading as overwide. */
    --data-table-selection-padding-inline: var(--space-2);
  }

  .DataTable {
    gap: var(--space-2);
  }

  .TableWindow {
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    scrollbar-color: var(--text-2) transparent;
    scrollbar-width: thin;
  }

  table {
    font-family: var(--font-sans);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    text-box: trim-both cap alphabetic;
  }

  th {
    height: var(--data-table-header-height);
    padding: 0 var(--data-table-cell-padding-inline);
    font-weight: var(--font-weight-medium);
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    color: var(--text-2);
    background: var(--surface-1);
    border-bottom: var(--border-width-thin) solid var(--border);
  }

  th[aria-sort]:hover {
    color: var(--text-1);
  }

  .HeaderContent {
    gap: var(--space-1);
  }

  .SortIcon {
    width: var(--space-3_5);
    height: var(--space-3_5);
    opacity: 0.4;
  }

  th[aria-sort="ascending"] .SortIcon,
  th[aria-sort="descending"] .SortIcon {
    opacity: 1;
    color: var(--text-1);
  }

  tbody tr {
    border-bottom: var(--border-width-thin) solid var(--border);
    transition-property: background, filter, transform;
    transition-duration: var(--duration-fast);
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  tbody tr:hover {
    background: var(--surface-1);
  }

  /* Selected rows stay tinted, and must beat the neutral :hover rule above.
    Same specificity, so source order (these come later) decides — without
    these, hovering a selected row would wipe its selected background. */
  tbody tr[aria-selected="true"] {
    background: var(--data-table-selected-background);
  }

  tbody tr[aria-selected="true"]:hover {
    background: oklch(from var(--accent) l c h / 0.18);
  }

  td {
    padding: var(--data-table-cell-padding-block)
      var(--data-table-cell-padding-inline);
    vertical-align: middle;
  }

  /* Selection column: tighter inline padding so the narrow checkbox column
    doesn't read as over-wide (width comes from the primitive's width: 1%). */
  [part~="selection"] {
    padding-inline: var(--data-table-selection-padding-inline);
  }

  .EmptyRow td {
    height: var(--space-24);
    text-align: center;
    color: var(--text-2);
  }

  .Pagination {
    padding: 0 var(--space-1);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    color: var(--text-2);
  }

  .PageInfo {
    gap: var(--space-1);
  }

  .PageControls {
    gap: var(--space-1);
  }

  .PageButton {
    width: var(--component-height-sm);
    height: var(--component-height-sm);
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    color: var(--text-1);
    font-size: var(--text-sm); line-height: var(--text-sm--line-height);
    transition-property: background;
    transition-duration: var(--duration-fast);
  }

  .PageButton:hover:not(:disabled) {
    background: var(--surface-1);
  }

  .PageButton:disabled {
    opacity: 0.4;
  }

  .PageButton:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--focus-ring-offset) var(--background),
      0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color);
  }
`;

export class DuiDataTable<
  T extends Record<string, unknown> = Record<string, unknown>,
> extends DuiDataTablePrimitive<T> {
  static override styles = [...DuiDataTablePrimitive.styles, styles];
}

customElements.define(DuiDataTable.tagName, DuiDataTable);
