import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-stepper")
export class DocsPageStepper extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-stepper">

        <dui-docs-demo label="Default">
          <dui-stepper default-value="5"></dui-stepper>
        </dui-docs-demo>

        <dui-docs-demo label="With Min/Max (0–10)">
          <dui-stepper default-value="5" min="0" max="10"></dui-stepper>
        </dui-docs-demo>

        <dui-docs-demo label="Custom Step (0.1)">
          <dui-stepper default-value="1.0" step="0.1" min="0" max="5"></dui-stepper>
        </dui-docs-demo>

        <dui-docs-demo label="Small size">
          <dui-stepper default-value="42" size="sm"></dui-stepper>
        </dui-docs-demo>

        <dui-docs-demo label="With Field Label">
          <dui-field label="Quantity">
            <dui-stepper default-value="1" min="1" max="99"></dui-stepper>
          </dui-field>
        </dui-docs-demo>

        <dui-docs-demo label="Disabled">
          <dui-stepper default-value="42" disabled></dui-stepper>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
