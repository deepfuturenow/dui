import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-switch")
export class DocsPageSwitch extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-switch")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="States">
        <div class="row">
          <dui-switch>Default</dui-switch>
        </div>
        <div class="row">
          <dui-switch default-checked>Default checked</dui-switch>
        </div>
        <div class="row">
          <dui-switch disabled>Disabled</dui-switch>
        </div>
        <div class="row">
          <dui-switch read-only default-checked>Read only</dui-switch>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
