import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { ColumnDef } from "@dui/components/data-table";

interface Member {
  name: string;
  email: string;
  role: string;
  status: string;
}

const COLUMNS: ColumnDef<Member>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "email", header: "Email", sortable: true },
  { key: "role", header: "Role", sortable: true },
  {
    key: "status",
    header: "Status",
    render: (value) => {
      const v = value as string;
      return html`<dui-badge variant="${v === "Active" ? "success" : "default"}" appearance="${v === "Active" ? "default" : "outline"}">${v}</dui-badge>`;
    },
  },
];

const DATA: Member[] = [
  { name: "Alice Johnson", email: "alice@acme.co", role: "Admin", status: "Active" },
  { name: "Bob Smith", email: "bob@acme.co", role: "Editor", status: "Active" },
  { name: "Carol White", email: "carol@acme.co", role: "Viewer", status: "Inactive" },
  { name: "Dave Brown", email: "dave@acme.co", role: "Editor", status: "Active" },
  { name: "Eve Davis", email: "eve@acme.co", role: "Admin", status: "Active" },
  { name: "Frank Miller", email: "frank@acme.co", role: "Viewer", status: "Inactive" },
  { name: "Grace Lee", email: "grace@acme.co", role: "Editor", status: "Active" },
  { name: "Henry Wilson", email: "henry@acme.co", role: "Viewer", status: "Active" },
];

@customElement("block-members")
export class BlockMembers extends LitElement {
  static override styles = css`
    :host {
      display: block;
      border: var(--border-width-thin, 1px) solid var(--border);
      border-radius: var(--radius-lg, 0.75rem);
      padding: var(--space-6, 1.5rem);
      background: var(--surface-2);
      color: var(--text-1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-4, 1rem);
    }

    .title {
      font-size: var(--font-size-base, 1rem);
      font-weight: 600;
      margin: 0;
    }

    .title span {
      font-weight: 400;
      color: var(--text-2);
    }

    .search-row {
      display: flex;
      gap: var(--space-2, 0.5rem);
      margin-bottom: var(--space-3, 0.75rem);
    }

    .search-row dui-input {
      flex: 1;
    }
  `;

  @state()
  accessor #filter = "";

  get #filteredData(): Member[] {
    if (!this.#filter) return DATA;
    const q = this.#filter.toLowerCase();
    return DATA.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
    );
  }

  override firstUpdated() {
    const table = this.shadowRoot?.querySelector("dui-data-table");
    if (table) {
      (table as any).columns = COLUMNS;
      (table as any).data = this.#filteredData;
      (table as any).pageSize = 5;
    }
  }

  override updated() {
    const table = this.shadowRoot?.querySelector("dui-data-table");
    if (table) {
      (table as any).data = this.#filteredData;
    }
  }

  #onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.#filter = input.value;
  }

  override render() {
    return html`
      <div class="header">
        <p class="title">Members <span>(${DATA.length})</span></p>
        <dui-button size="sm">Invite</dui-button>
      </div>

      <div class="search-row">
        <dui-input
          placeholder="Filter members..."
          @input="${this.#onInput}"
        ></dui-input>
      </div>

      <dui-data-table></dui-data-table>
    `;
  }
}
