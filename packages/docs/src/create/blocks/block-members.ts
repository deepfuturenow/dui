import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { gridOverlay } from "./block-base.ts";
import type { ColumnDef } from "@dui/components/data-table";

interface Member {
  name: string;
  email: string;
  role: string;
  status: string;
}

const COLUMNS: ColumnDef<Member>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "role", header: "Role", sortable: true },
  {
    key: "status",
    header: "Status",
    width: "1%",
    render: (value) => {
      const v = value as string;
      return html`<dui-badge variant="${v === "Active" ? "primary" : "neutral"}" appearance="${v === "Active" ? "soft" : "outline"}">${v}</dui-badge>`;
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
  static override styles = [gridOverlay, css`
    :host {
      display: block;
      position: relative;
    }

    /* Card */
    dui-card::part(root) {
      padding-bottom: var(--space-5);
    }

    .title-count {
      font-weight: var(--font-weight-regular);
      color: var(--text-2);
    }

    .search-row {
      display: flex;
      gap: var(--space-2);
      margin-bottom: var(--space-2);
    }

    .search-row dui-input {
      flex: 1;
    }
  `];

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
      <dui-card>
        <span slot="title">Members <span class="title-count">(${DATA.length})</span></span>
        <dui-button slot="action" size="sm">Invite</dui-button>

        <div class="search-row">
          <dui-input
            placeholder="Filter members..."
            @input="${this.#onInput}"
          ></dui-input>
        </div>

        <dui-data-table></dui-data-table>
      </dui-card>
    `;
  }
}
