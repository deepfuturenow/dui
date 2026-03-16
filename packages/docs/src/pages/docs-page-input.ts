import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-input")
export class DocsPageInput extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-input")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <dui-input placeholder="Enter text..."></dui-input>
      </dui-docs-demo>

      <dui-docs-demo label="Types">
        <dui-vstack gap="3">
          <dui-input type="text" placeholder="Text"></dui-input>
          <dui-input type="email" placeholder="Email"></dui-input>
          <dui-input type="password" placeholder="Password"></dui-input>
          <dui-input type="number" placeholder="Number"></dui-input>
        </dui-vstack>
      </dui-docs-demo>

      <dui-docs-demo label="States">
        <dui-vstack gap="3">
          <dui-input placeholder="Default"></dui-input>
          <dui-input placeholder="Disabled" disabled></dui-input>
          <dui-input placeholder="Read-only" readonly value="Read-only value"></dui-input>
        </dui-vstack>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
