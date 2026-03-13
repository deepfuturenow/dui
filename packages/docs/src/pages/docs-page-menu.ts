import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-menu")
export class DocsPageMenu extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-menu")!;
    const itemMeta = componentRegistry.find((c) => c.tagName === "dui-menu-item")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic menu">
        <dui-menu>
          <dui-button slot="trigger" variant="outline">Open Menu</dui-button>
          <dui-menu-item>Edit</dui-menu-item>
          <dui-menu-item>Duplicate</dui-menu-item>
          <dui-menu-item>Archive</dui-menu-item>
        </dui-menu>
      </dui-docs-demo>

      <dui-docs-demo label="With danger variant and disabled">
        <dui-menu>
          <dui-button slot="trigger" variant="outline">Actions</dui-button>
          <dui-menu-item>Edit</dui-menu-item>
          <dui-menu-item>Duplicate</dui-menu-item>
          <dui-menu-item disabled>Move (disabled)</dui-menu-item>
          <dui-menu-item variant="danger">Delete</dui-menu-item>
        </dui-menu>
      </dui-docs-demo>

      <h2>API Reference — Menu</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Menu Item</h2>
      ${renderApiTable(itemMeta)}
    `;
  }
}
