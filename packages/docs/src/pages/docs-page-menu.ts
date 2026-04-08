import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-menu")
export class DocsPageMenu extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-menu" .additionalTags=${["dui-menu-item"]}>
        <dui-docs-demo label="Basic menu">
        <dui-menu>
          <dui-button slot="trigger" appearance="outline">Open Menu</dui-button>
          <dui-menu-item>Edit</dui-menu-item>
          <dui-menu-item>Duplicate</dui-menu-item>
          <dui-menu-item>Archive</dui-menu-item>
        </dui-menu>
      </dui-docs-demo>

      <dui-docs-demo label="With danger variant and disabled">
        <dui-menu>
          <dui-button slot="trigger" appearance="outline">Actions</dui-button>
          <dui-menu-item>Edit</dui-menu-item>
          <dui-menu-item>Duplicate</dui-menu-item>
          <dui-menu-item disabled>Move (disabled)</dui-menu-item>
          <dui-menu-item variant="danger">Delete</dui-menu-item>
        </dui-menu>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
