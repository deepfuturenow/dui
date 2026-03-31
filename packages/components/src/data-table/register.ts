import { DuiDataTable } from "./data-table.ts";

if (!customElements.get(DuiDataTable.tagName)) {
  customElements.define(DuiDataTable.tagName, DuiDataTable);
}
