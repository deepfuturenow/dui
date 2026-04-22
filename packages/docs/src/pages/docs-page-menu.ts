import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-menu")
export class DocsPageMenu extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    // SVG icons for keyboard shortcuts
    const cmdIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"/></svg>`;
    const shiftIcon = html`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-6a1 1 0 0 1 1-1h3.293a.707.707 0 0 0 .5-1.207l-7.086-7.086a1 1 0 0 0-1.414 0l-7.086 7.086a.707.707 0 0 0 .5 1.207H8a1 1 0 0 1 1 1z"/></svg>`;

    const shortcutStyle = "display:inline-flex;align-items:center;gap:2px;margin-left:auto;font-size:var(--text-xs);font-family:var(--font-sans);color:var(--text-3)";

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

      <dui-docs-demo label="With keyboard shortcuts and separator">
        <dui-menu popup-min-width="calc(var(--space-1) * 36)">
          <dui-button slot="trigger" appearance="outline">Edit</dui-button>
          <dui-menu-item>
            Undo
            <span style="${shortcutStyle}">${cmdIcon}Z</span>
          </dui-menu-item>
          <dui-menu-item>
            Redo
            <span style="${shortcutStyle}">${shiftIcon}${cmdIcon}Z</span>
          </dui-menu-item>
          <dui-separator></dui-separator>
          <dui-menu-item>
            Cut
            <span style="${shortcutStyle}">${cmdIcon}X</span>
          </dui-menu-item>
          <dui-menu-item>
            Copy
            <span style="${shortcutStyle}">${cmdIcon}C</span>
          </dui-menu-item>
          <dui-menu-item>
            Paste
            <span style="${shortcutStyle}">${cmdIcon}V</span>
          </dui-menu-item>
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
