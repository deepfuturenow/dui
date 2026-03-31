import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-radio")
export class DocsPageRadio extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const groupMeta = componentRegistry.find((c) => c.tagName === "dui-radio-group")!;
    const radioMeta = componentRegistry.find((c) => c.tagName === "dui-radio")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${groupMeta.name}</h1>
      <p class="description">${groupMeta.description}</p>

      <dui-docs-demo label="Default">
        <dui-radio-group default-value="apple">
          <dui-radio value="apple">Apple</dui-radio>
          <dui-radio value="banana">Banana</dui-radio>
          <dui-radio value="cherry">Cherry</dui-radio>
        </dui-radio-group>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-radio-group default-value="a" disabled>
          <dui-radio value="a">Option A</dui-radio>
          <dui-radio value="b">Option B</dui-radio>
        </dui-radio-group>
      </dui-docs-demo>

      <dui-docs-demo label="Read-only">
        <dui-radio-group default-value="x" read-only>
          <dui-radio value="x">Option X</dui-radio>
          <dui-radio value="y">Option Y</dui-radio>
        </dui-radio-group>
      </dui-docs-demo>

      <h2>API Reference — Radio Group</h2>
      ${renderApiTable(groupMeta)}

      <h2>API Reference — Radio</h2>
      ${renderApiTable(radioMeta)}
    `;
  }
}
