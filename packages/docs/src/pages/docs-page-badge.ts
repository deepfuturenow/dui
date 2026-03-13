import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-badge")
export class DocsPageBadge extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-badge")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Variants">
        <div class="row">
          <dui-badge>Default</dui-badge>
          <dui-badge variant="secondary">Secondary</dui-badge>
          <dui-badge variant="destructive">Destructive</dui-badge>
          <dui-badge variant="outline">Outline</dui-badge>
          <dui-badge variant="success">Success</dui-badge>
          <dui-badge variant="warning">Warning</dui-badge>
          <dui-badge variant="info">Info</dui-badge>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
