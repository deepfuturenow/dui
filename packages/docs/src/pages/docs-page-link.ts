import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-link")
export class DocsPageLink extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-link")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic">
        <dui-link href="#/components/button">Go to Button page</dui-link>
      </dui-docs-demo>

      <dui-docs-demo label="Inline with text">
        <p style="margin: 0;">
          Check out the
          <dui-link href="#/components/badge" style="color: var(--primary); text-decoration: underline;">Badge component</dui-link>
          for status indicators.
        </p>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
