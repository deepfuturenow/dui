import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-input")
export class DocsPageInput extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-input">
        <dui-docs-demo label="Default">
        <dui-input placeholder="Enter text..."></dui-input>
      </dui-docs-demo>

      <dui-docs-demo label="Types">
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <dui-input type="text" placeholder="Text"></dui-input>
          <dui-input type="email" placeholder="Email"></dui-input>
          <dui-input type="password" placeholder="Password"></dui-input>
          <dui-input type="number" placeholder="Number"></dui-input>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="States">
        <div style="display: flex; flex-direction: column; gap: var(--space-3);">
          <dui-input placeholder="Default"></dui-input>
          <dui-input placeholder="Disabled" disabled></dui-input>
          <dui-input placeholder="Read-only" readonly value="Read-only value"></dui-input>
        </div>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
