import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-accordion")
export class DocsPageAccordion extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-accordion" .additionalTags=${["dui-accordion-item"]}>
        <dui-docs-demo label="Single mode (default)" demo-width="25rem">
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

      <dui-docs-demo label="Multiple mode" demo-width="25rem">
        <dui-accordion multiple default-value='["m-1","m-2"]'>
          <dui-accordion-item value="m-1">
            <span slot="trigger">First section</span>
            Multiple items can be open at once.
          </dui-accordion-item>
          <dui-accordion-item value="m-2">
            <span slot="trigger">Second section</span>
            Ullamco minim amet sint excepteur aute aliqua quis ut officia id. Sit irure esse non eiusmod nisi. Lorem irure consectetur adipisicing cillum. Sit voluptate dolore irure occaecat minim tempor do mollit dolor cillum excepteur reprehenderit. Voluptate laborum culpa excepteur dolor occaecat duis commodo commodo. Magna nulla eiusmod labore cillum qui ullamco dolore adipisicing eu ipsum magna ut ullamco.
          </dui-accordion-item>
          <dui-accordion-item value="m-3">
            <span slot="trigger">Third section</span>
            Try opening all three.
          </dui-accordion-item>
        </dui-accordion>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled" demo-width="25rem">
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
      </docs-page-layout>
    `;
  }
}
