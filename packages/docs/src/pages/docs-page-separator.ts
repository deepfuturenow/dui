import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-separator")
export class DocsPageSeparator extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-separator")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Horizontal">
        <div>
          <p style="margin: 0 0 var(--space-3);">Content above</p>
          <dui-separator></dui-separator>
          <p style="margin: var(--space-3) 0 0;">Content below</p>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Vertical">
        <div class="row" style="height: var(--space-6);">
          <span>Left</span>
          <dui-separator orientation="vertical"></dui-separator>
          <span>Center</span>
          <dui-separator orientation="vertical"></dui-separator>
          <span>Right</span>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
