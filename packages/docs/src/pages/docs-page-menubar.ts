import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-menubar")
export class DocsPageMenubar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-menubar")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

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

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
