import { css } from "lit";
import { DuiDataTablePrimitive } from "@dui/primitives/data-table";
import "../_install.ts";

const styles = css`
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
    height: var(--component-height-lg);
    padding: 0 var(--space-3);
    font-weight: var(--font-weight-medium);
    font-size: var(--text-xs); line-height: var(--text-xs--line-height);
    text-box: trim-both cap alphabetic;
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

  td {
    padding: var(--space-2) var(--space-3);
    vertical-align: middle;
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
