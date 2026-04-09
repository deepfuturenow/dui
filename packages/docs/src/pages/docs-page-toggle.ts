import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-toggle")
export class DocsPageToggle extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-toggle">
        <dui-docs-demo label="With Icon">
        <docs-row>
          <dui-toggle aria-label="Pan" default-pressed>
            <dui-icon slot="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="m15 19-3 3-3-3"/><path d="m19 9 3 3-3 3"/><path d="M2 12h20"/><path d="m5 9-3 3 3 3"/><path d="m9 5 3-3 3 3"/></svg></dui-icon>
            Pan
          </dui-toggle>
          <dui-toggle aria-label="Tilt">
            <dui-icon slot="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg></dui-icon>
            Tilt
          </dui-toggle>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Default Pressed">
        <dui-toggle default-pressed aria-label="Toggle bold">
          <strong>B</strong>
        </dui-toggle>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-toggle disabled aria-label="Toggle bold">
          <strong>B</strong>
        </dui-toggle>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
