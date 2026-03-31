import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-page-inset")
export class DocsPagePageInset extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-page-inset")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <div style="border: 1px dashed var(--border); container-type: size; height: 200px;">
          <dui-page-inset>
            <p style="margin: 0;">Content is centered with max-width and padding.</p>
          </dui-page-inset>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Custom max-width">
        <div style="border: 1px dashed var(--border); container-type: size; height: 200px;">
          <dui-page-inset max-width="20rem">
            <p style="margin: 0;">Narrower max-width (20rem).</p>
          </dui-page-inset>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
