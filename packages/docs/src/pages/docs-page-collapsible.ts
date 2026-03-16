import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-collapsible")
export class DocsPageCollapsible extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-collapsible")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default (closed)">
        <dui-collapsible>
          <span slot="trigger">Click to expand</span>
          This content is revealed when the collapsible is opened. It animates
          smoothly with a height transition.
        </dui-collapsible>
      </dui-docs-demo>

      <dui-docs-demo label="Default open">
        <dui-collapsible default-open>
          <span slot="trigger">Started open</span>
          This collapsible starts in the open state using the default-open attribute.
        </dui-collapsible>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-collapsible disabled>
          <span slot="trigger">Cannot toggle</span>
          This content is not reachable.
        </dui-collapsible>
      </dui-docs-demo>

      <dui-docs-demo label="Multiple collapsibles">
        <dui-collapsible>
          <span slot="trigger">First section</span>
          Each collapsible operates independently.
        </dui-collapsible>
        <dui-collapsible>
          <span slot="trigger">Second section</span>
          Open and close any combination.
        </dui-collapsible>
        <dui-collapsible>
          <span slot="trigger">Third section</span>
          Unlike accordion, there is no mutual exclusion.
        </dui-collapsible>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
