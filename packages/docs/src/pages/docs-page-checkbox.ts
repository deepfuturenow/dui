import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-checkbox")
export class DocsPageCheckbox extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-checkbox")!;
    const groupMeta = componentRegistry.find((c) => c.tagName === "dui-checkbox-group")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="States">
        <div class="row">
          <dui-checkbox>Unchecked</dui-checkbox>
        </div>
        <div class="row">
          <dui-checkbox default-checked>Checked</dui-checkbox>
        </div>
        <div class="row">
          <dui-checkbox indeterminate>Indeterminate</dui-checkbox>
        </div>
        <div class="row">
          <dui-checkbox disabled>Disabled</dui-checkbox>
        </div>
        <div class="row">
          <dui-checkbox disabled default-checked>Disabled checked</dui-checkbox>
        </div>
        <div class="row">
          <dui-checkbox read-only default-checked>Read only</dui-checkbox>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Group">
        <dui-checkbox-group>
          <dui-checkbox value="apple">Apple</dui-checkbox>
          <dui-checkbox value="banana">Banana</dui-checkbox>
          <dui-checkbox value="cherry">Cherry</dui-checkbox>
        </dui-checkbox-group>
      </dui-docs-demo>

      <dui-docs-demo label="Group with select all">
        <dui-checkbox-group .allValues=${["red", "green", "blue"]}>
          <dui-checkbox parent value="all">Select all</dui-checkbox>
          <dui-checkbox value="red">Red</dui-checkbox>
          <dui-checkbox value="green">Green</dui-checkbox>
          <dui-checkbox value="blue">Blue</dui-checkbox>
        </dui-checkbox-group>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled group">
        <dui-checkbox-group disabled>
          <dui-checkbox value="a">Option A</dui-checkbox>
          <dui-checkbox value="b">Option B</dui-checkbox>
        </dui-checkbox-group>
      </dui-docs-demo>

      <h2>API Reference — Checkbox</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Checkbox Group</h2>
      ${renderApiTable(groupMeta)}
    `;
  }
}
