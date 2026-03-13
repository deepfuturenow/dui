import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-button")
export class DocsPageButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-button")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Variants">
        <div class="row">
          <dui-button>Default</dui-button>
          <dui-button variant="secondary">Secondary</dui-button>
          <dui-button variant="destructive">Destructive</dui-button>
          <dui-button variant="outline">Outline</dui-button>
          <dui-button variant="ghost">Ghost</dui-button>
          <dui-button variant="link">Link</dui-button>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <div class="row">
          <dui-button size="sm">Small</dui-button>
          <dui-button size="md">Medium</dui-button>
          <dui-button size="lg">Large</dui-button>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Rounded / Disabled / Link">
        <div class="row">
          <dui-button rounded>Rounded</dui-button>
          <dui-button disabled>Disabled</dui-button>
          <dui-button href="/example">Link button</dui-button>
        </div>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
