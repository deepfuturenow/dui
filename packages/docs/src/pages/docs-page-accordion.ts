import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-accordion")
export class DocsPageAccordion extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-accordion")!;
    const itemMeta = componentRegistry.find((c) => c.tagName === "dui-accordion-item")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Single mode (default)">
        <dui-accordion default-value='["item-1"]'>
          <dui-accordion-item value="item-1">
            <span slot="trigger">Is it accessible?</span>
            Yes. It adheres to the WAI-ARIA design pattern.
          </dui-accordion-item>
          <dui-accordion-item value="item-2">
            <span slot="trigger">Is it styled?</span>
            Yes. It comes with default styles via the theme system.
          </dui-accordion-item>
          <dui-accordion-item value="item-3">
            <span slot="trigger">Is it animated?</span>
            Yes. It uses height transitions with reduced-motion support.
          </dui-accordion-item>
        </dui-accordion>
      </dui-docs-demo>

      <dui-docs-demo label="Multiple mode">
        <dui-accordion multiple default-value='["m-1","m-2"]'>
          <dui-accordion-item value="m-1">
            <span slot="trigger">First section</span>
            Multiple items can be open at once.
          </dui-accordion-item>
          <dui-accordion-item value="m-2">
            <span slot="trigger">Second section</span>
            This one starts open too.
          </dui-accordion-item>
          <dui-accordion-item value="m-3">
            <span slot="trigger">Third section</span>
            Try opening all three.
          </dui-accordion-item>
        </dui-accordion>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-accordion disabled>
          <dui-accordion-item value="d-1">
            <span slot="trigger">Disabled globally</span>
            You cannot open this.
          </dui-accordion-item>
        </dui-accordion>

        <dui-accordion>
          <dui-accordion-item value="di-1" disabled>
            <span slot="trigger">Disabled per-item</span>
            Only this item is disabled.
          </dui-accordion-item>
          <dui-accordion-item value="di-2">
            <span slot="trigger">This one works</span>
            This item is enabled.
          </dui-accordion-item>
        </dui-accordion>
      </dui-docs-demo>

      <h2>API Reference — Accordion</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Accordion Item</h2>
      ${renderApiTable(itemMeta)}
    `;
  }
}
