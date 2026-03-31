import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-spinner")
export class DocsPageSpinner extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-spinner")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Variants">
        <div class="row">
          <dui-spinner variant="pulse"></dui-spinner>
          <dui-spinner variant="lucide-loader"></dui-spinner>
          <dui-spinner variant="lucide-loader-circle"></dui-spinner>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <div class="row">
          <dui-spinner size="sm"></dui-spinner>
          <dui-spinner size="md"></dui-spinner>
          <dui-spinner size="lg"></dui-spinner>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes — lucide-loader-circle">
        <div class="row">
          <dui-spinner variant="lucide-loader-circle" size="sm"></dui-spinner>
          <dui-spinner variant="lucide-loader-circle" size="md"></dui-spinner>
          <dui-spinner variant="lucide-loader-circle" size="lg"></dui-spinner>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
