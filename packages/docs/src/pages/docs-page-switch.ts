import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-switch")
export class DocsPageSwitch extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-switch">
        <dui-docs-demo label="States">
        <docs-row>
          <dui-switch>Default</dui-switch>
        </docs-row>
        <docs-row>
          <dui-switch default-checked>Default checked</dui-switch>
        </docs-row>
        <docs-row>
          <dui-switch disabled>Disabled</dui-switch>
        </docs-row>
        <docs-row>
          <dui-switch read-only default-checked>Read only</dui-switch>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
