import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-icon")
export class DocsPageIcon extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-icon")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic icons">
        <div class="row">
          <dui-icon icon="home"></dui-icon>
          <dui-icon icon="settings"></dui-icon>
          <dui-icon icon="search"></dui-icon>
          <dui-icon icon="favorite"></dui-icon>
          <dui-icon icon="check_circle"></dui-icon>
          <dui-icon icon="close"></dui-icon>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Custom sizes">
        <div class="row" style="align-items: end;">
          <dui-icon icon="star" size="var(--space-3)"></dui-icon>
          <dui-icon icon="star" size="var(--space-4_5)"></dui-icon>
          <dui-icon icon="star" size="var(--space-6)"></dui-icon>
          <dui-icon icon="star" size="var(--space-8)"></dui-icon>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Custom colors">
        <div class="row">
          <dui-icon icon="error" color="var(--destructive)"></dui-icon>
          <dui-icon icon="check_circle" color="var(--success)"></dui-icon>
          <dui-icon icon="info" color="var(--primary)"></dui-icon>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
