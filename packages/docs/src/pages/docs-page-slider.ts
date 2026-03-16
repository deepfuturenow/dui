import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-slider")
export class DocsPageSlider extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-slider")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default (0–100)">
        <dui-slider value="50"></dui-slider>
      </dui-docs-demo>

      <dui-docs-demo label="Custom range (0–10, step 1)">
        <dui-slider value="3" min="0" max="10" step="1"></dui-slider>
      </dui-docs-demo>

      <dui-docs-demo label="Fine step (0–1, step 0.01)">
        <dui-slider value="0.5" min="0" max="1" step="0.01"></dui-slider>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-slider value="70" disabled></dui-slider>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
