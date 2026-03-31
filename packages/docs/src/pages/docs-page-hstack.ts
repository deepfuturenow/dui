import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-hstack")
export class DocsPageHstack extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-hstack")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default (gap=4)">
        <dui-hstack>
          <dui-badge>One</dui-badge>
          <dui-badge>Two</dui-badge>
          <dui-badge>Three</dui-badge>
        </dui-hstack>
      </dui-docs-demo>

      <dui-docs-demo label="Gap sizes">
        <dui-vstack gap="4">
          <dui-hstack gap="1">
            <dui-badge variant="secondary">gap=1</dui-badge>
            <dui-badge variant="secondary">A</dui-badge>
            <dui-badge variant="secondary">B</dui-badge>
          </dui-hstack>
          <dui-hstack gap="4">
            <dui-badge variant="secondary">gap=4</dui-badge>
            <dui-badge variant="secondary">A</dui-badge>
            <dui-badge variant="secondary">B</dui-badge>
          </dui-hstack>
          <dui-hstack gap="8">
            <dui-badge variant="secondary">gap=8</dui-badge>
            <dui-badge variant="secondary">A</dui-badge>
            <dui-badge variant="secondary">B</dui-badge>
          </dui-hstack>
        </dui-vstack>
      </dui-docs-demo>

      <dui-docs-demo label="Justify">
        <dui-vstack gap="4">
          <dui-hstack justify="start">
            <dui-badge>start</dui-badge>
            <dui-badge>A</dui-badge>
          </dui-hstack>
          <dui-hstack justify="center">
            <dui-badge>center</dui-badge>
            <dui-badge>A</dui-badge>
          </dui-hstack>
          <dui-hstack justify="end">
            <dui-badge>end</dui-badge>
            <dui-badge>A</dui-badge>
          </dui-hstack>
          <dui-hstack justify="between">
            <dui-badge>between</dui-badge>
            <dui-badge>A</dui-badge>
          </dui-hstack>
        </dui-vstack>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
