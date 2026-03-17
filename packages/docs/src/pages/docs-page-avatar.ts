import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-avatar")
export class DocsPageAvatar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-avatar")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="With fallback initials">
        <div class="row">
          <dui-avatar>JC</dui-avatar>
          <dui-avatar>AB</dui-avatar>
          <dui-avatar>ZK</dui-avatar>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <div class="row" style="align-items: center;">
          <dui-avatar size="var(--space-8)">S</dui-avatar>
          <dui-avatar>M</dui-avatar>
          <dui-avatar size="var(--space-16)">L</dui-avatar>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="With icon fallback">
        <dui-avatar>
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></dui-icon>
        </dui-avatar>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
