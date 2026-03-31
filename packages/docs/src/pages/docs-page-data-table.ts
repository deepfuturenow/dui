import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-data-table")
export class DocsPageDataTable extends LitElement {
  protected override createRenderRoot() { return this; }

  override connectedCallback(): void {
    super.connectedCallback();
    requestAnimationFrame(() => {
      const tables = this.querySelectorAll("dui-data-table");

      const columns = [
        { key: "name", header: "Name", sortable: true },
        { key: "email", header: "Email", sortable: true },
        { key: "role", header: "Role", sortable: true },
        { key: "status", header: "Status" },
      ];

      const data = [
        { name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
        { name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "Active" },
        { name: "Carol White", email: "carol@example.com", role: "Viewer", status: "Inactive" },
        { name: "Dave Brown", email: "dave@example.com", role: "Editor", status: "Active" },
        { name: "Eve Davis", email: "eve@example.com", role: "Admin", status: "Active" },
        { name: "Frank Miller", email: "frank@example.com", role: "Viewer", status: "Inactive" },
        { name: "Grace Lee", email: "grace@example.com", role: "Editor", status: "Active" },
        { name: "Henry Wilson", email: "henry@example.com", role: "Viewer", status: "Active" },
        { name: "Iris Taylor", email: "iris@example.com", role: "Admin", status: "Active" },
        { name: "Jack Thomas", email: "jack@example.com", role: "Editor", status: "Inactive" },
        { name: "Kate Moore", email: "kate@example.com", role: "Viewer", status: "Active" },
        { name: "Leo Martin", email: "leo@example.com", role: "Editor", status: "Active" },
      ];

      tables.forEach((el: any) => {
        el.columns = columns;
        el.data = data;
        if (el.id === "table-small-page") {
          el.pageSize = 5;
        }
        if (el.id === "table-no-pagination") {
          el.pageSize = 0;
        }
      });
    });
  }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-data-table")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default (10 rows/page)">
        <dui-data-table></dui-data-table>
      </dui-docs-demo>

      <dui-docs-demo label="5 rows per page">
        <dui-data-table id="table-small-page"></dui-data-table>
      </dui-docs-demo>

      <dui-docs-demo label="No pagination">
        <dui-data-table id="table-no-pagination"></dui-data-table>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
