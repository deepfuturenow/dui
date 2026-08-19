import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

const gestureStyles = `
  h3 {
    font-size: var(--text-base, 1rem);
    font-weight: 600;
    margin: var(--space-6, 1.5rem) 0 var(--space-2);
  }

  .gesture-info {
    margin-bottom: var(--space-4, 1rem);
  }

  .gesture-info p,
  .gesture-info li {
    font-size: var(--text-sm, 0.875rem);
    color: var(--text-2);
  }

  .gesture-info p {
    margin: 0 0 var(--space-3, 0.75rem);
  }

  .gesture-info ul {
    margin: 0 0 var(--space-3, 0.75rem);
    padding-left: var(--space-5, 1.25rem);
  }

  .gesture-info li {
    margin-bottom: var(--space-1, 0.25rem);
  }

  .gesture-info strong {
    color: var(--text-1);
    font-weight: 600;
  }

  .gesture-log {
    font-family: var(--font-mono);
    font-size: var(--text-xs, 0.75rem);
    color: var(--text-2);
    margin: var(--space-2) 0 0;
    min-height: 1.2em;
  }
`;

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

      const logAction = (message: string) => {
        const log = this.querySelector("#gesture-log");
        if (log) log.textContent = message;
      };

      // The selection demo gets its own columns so the other tables stay plain:
      // a real <a href> and a real button let you see that Cmd-click yields to
      // the link but overrides the button.
      const selectionColumns = [
        {
          key: "name",
          header: "Name",
          sortable: true,
          render: (value: unknown) =>
            html`<a
              href="#/components/data-table"
              style="color: var(--accent); text-decoration: underline;"
              >${value}</a
            >`,
        },
        { key: "email", header: "Email", sortable: true },
        { key: "role", header: "Role", sortable: true },
        { key: "status", header: "Status" },
        {
          key: "actions",
          header: "",
          render: (_value: unknown, row: { name: string }) =>
            html`<dui-button
              appearance="ghost"
              size="xs"
              @click=${() => logAction(`Edit fired for ${row.name}`)}
              >Edit</dui-button
            >`,
        },
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
        if (el.id === "table-selection") {
          el.columns = selectionColumns;
          // No pagination: a range gesture needs more than a page of rows to be
          // worth demonstrating, and the anchor resets on every page change.
          el.pageSize = 0;
          el.rowKey = (row: { email: string }) => row.email;
          el.selectedKeys = ["bob@example.com", "dave@example.com"];
          // Selection is controlled: reflect each proposed change back into
          // selectedKeys so the checkboxes and row styling stay in sync.
          el.addEventListener(
            "selection-change",
            (e: CustomEvent<{ selectedKeys: string[] }>) => {
              el.selectedKeys = e.detail.selectedKeys;
            },
          );
          el.addEventListener(
            "row-click",
            (e: CustomEvent<{ row: { name: string } }>) => {
              logAction(`row-click fired for ${e.detail.row.name}`);
            },
          );
        }
      });
    });
  }

  override render() {

    return html`
      <docs-page-layout tag="dui-data-table">
        <style>${gestureStyles}</style>

        <dui-docs-demo label="Default (10 rows/page)">
        <dui-data-table></dui-data-table>
      </dui-docs-demo>

      <h3>Row selection</h3>
      <div class="gesture-info">
        <p>
          Set <code>selection-mode="multiple"</code> and supply a <code>rowKey</code>. The checkbox
          column is the visible path, with a Finder-style accelerator layered on top. An unmodified
          click never changes the selection, so none of these collide with selecting text, following
          a link, or pressing a button in a cell.
        </p>
        <ul>
          <li><strong>⌘-click</strong> (Ctrl on Windows/Linux) anywhere on a row toggles it.</li>
          <li>
            <strong>⇧-click</strong> selects the range between the last row you touched and the one
            you click. Shift-clicking back inside a range contracts it, so you can walk the boundary
            in and out.
          </li>
          <li><strong>Escape</strong> clears the selection.</li>
        </ul>
        <p>
          Try it: ⌘-click <em>Carol White</em>, then ⇧-click <em>Iris Taylor</em>. Then ⌘-click
          <em>Edit</em> — the row is selected and the button does not fire. ⌘-click a name and the
          link opens in a new tab instead; links are the one carve-out.
        </p>
        <p>
          Sorting, filtering or changing page resets the anchor, so a range never spans pages.
          Selection itself is keyed by <code>rowKey</code> and survives all three.
        </p>
        <p>
          The gestures are deliberately undecorated — nothing in the table advertises them. If your
          app needs to surface them, the usual home is the “N selected” toolbar above the table.
        </p>
      </div>

      <dui-docs-demo label="Row selection (multiple)">
        <div>
          <dui-data-table id="table-selection" selection-mode="multiple"></dui-data-table>
          <p class="gesture-log" id="gesture-log"></p>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="5 rows per page">
        <dui-data-table id="table-small-page"></dui-data-table>
      </dui-docs-demo>

      <dui-docs-demo label="No pagination">
        <dui-data-table id="table-no-pagination"></dui-data-table>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
