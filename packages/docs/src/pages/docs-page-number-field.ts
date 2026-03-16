import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-number-field")
export class DocsPageNumberField extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-number-field")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <dui-number-field default-value="5"></dui-number-field>
      </dui-docs-demo>

      <dui-docs-demo label="With Min/Max (0-10)">
        <dui-number-field default-value="5" min="0" max="10"></dui-number-field>
      </dui-docs-demo>

      <dui-docs-demo label="Custom Step (0.1)">
        <dui-number-field default-value="1.0" step="0.1" min="0" max="5"></dui-number-field>
      </dui-docs-demo>

      <dui-docs-demo label="With Field Label">
        <dui-field label="Quantity">
          <dui-number-field default-value="1" min="1" max="99"></dui-number-field>
        </dui-field>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-number-field default-value="42" disabled></dui-number-field>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
