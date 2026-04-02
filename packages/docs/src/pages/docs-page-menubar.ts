import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-menubar")
export class DocsPageMenubar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-menubar">
        <dui-docs-demo label="Default">
        <dui-menubar>
          <dui-menu>
            <dui-button slot="trigger" variant="ghost" size="sm">File</dui-button>
            <dui-menu-item>New File</dui-menu-item>
            <dui-menu-item>Open</dui-menu-item>
            <dui-menu-item>Save</dui-menu-item>
            <dui-menu-item>Exit</dui-menu-item>
          </dui-menu>
          <dui-menu>
            <dui-button slot="trigger" variant="ghost" size="sm">Edit</dui-button>
            <dui-menu-item>Undo</dui-menu-item>
            <dui-menu-item>Redo</dui-menu-item>
            <dui-menu-item>Cut</dui-menu-item>
            <dui-menu-item>Copy</dui-menu-item>
            <dui-menu-item>Paste</dui-menu-item>
          </dui-menu>
          <dui-menu>
            <dui-button slot="trigger" variant="ghost" size="sm">View</dui-button>
            <dui-menu-item>Zoom In</dui-menu-item>
            <dui-menu-item>Zoom Out</dui-menu-item>
            <dui-menu-item>Reset Zoom</dui-menu-item>
          </dui-menu>
        </dui-menubar>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
