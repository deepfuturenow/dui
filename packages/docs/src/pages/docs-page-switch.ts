import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-switch")
export class DocsPageSwitch extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-switch">
        <dui-docs-demo label="States">
          <div style="display:flex;flex-direction:column;gap:var(--space-3)">
            <dui-switch>Default</dui-switch>
            <dui-switch default-checked>Default checked</dui-switch>
            <dui-switch disabled>Disabled</dui-switch>
            <dui-switch read-only default-checked>Read only</dui-switch>
          </div>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
