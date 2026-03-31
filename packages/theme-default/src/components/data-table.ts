import { css } from "lit";

export const dataTableStyles = css`
  .DataTable {
    gap: var(--space-2);
  }

  .TableWindow {
    border: var(--border-width-thin) solid var(--border);
    border-radius: var(--radius-md);
    scrollbar-color: var(--muted-foreground) transparent;
    scrollbar-width: thin;
  }

  table {
    font-family: var(--font-sans);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
  }

  th {
    height: var(--component-height-lg);
    padding: 0 var(--space-3);
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-xs);
    color: var(--muted-foreground);
    background-color: var(--muted);
    border-bottom: var(--border-width-thin) solid var(--border);
  }

  th[aria-sort]:hover {
    color: var(--foreground);
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
    color: var(--foreground);
  }

  tbody tr {
    border-bottom: var(--border-width-thin) solid var(--border);
    transition-duration: var(--duration-fast);
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: var(--muted);
  }

  td {
    padding: var(--space-2) var(--space-3);
    vertical-align: middle;
  }

  .EmptyRow td {
    height: 96px;
    text-align: center;
    color: var(--muted-foreground);
  }

  .Pagination {
    padding: 0 var(--space-1);
    font-size: var(--font-size-sm);
    color: var(--muted-foreground);
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
    color: var(--foreground);
    font-size: var(--font-size-sm);
    transition-property: background-color;
    transition-duration: var(--duration-fast);
  }

  .PageButton:hover:not(:disabled) {
    background-color: var(--muted);
  }

  .PageButton:disabled {
    opacity: 0.3;
  }

  .PageButton:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 var(--space-0_5) var(--background),
      0 0 0 var(--space-1) var(--ring);
  }
`;
