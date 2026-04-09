import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-toolbar")
export class DocsPageToolbar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-toolbar">
        <dui-docs-demo label="Basic 3-column layout">
        <dui-toolbar size="lg">
          <span slot="left">Left</span>
          <span slot="center">Center</span>
          <span slot="right">Right</span>
        </dui-toolbar>
      </dui-docs-demo>

      <dui-docs-demo label="With buttons">
        <dui-toolbar size="lg" inset has-button-left has-button-right>
          <dui-button slot="left" appearance="ghost" size="sm">Back</dui-button>
          <span slot="center">Page Title</span>
          <dui-button slot="right" variant="primary" size="sm">Save</dui-button>
        </dui-toolbar>
      </dui-docs-demo>

      <dui-docs-demo label="Size variants">
        <dui-toolbar size="sm" inset>
          <span slot="left">sm</span>
          <span slot="center">Small</span>
          <span slot="right">End</span>
        </dui-toolbar>
        <dui-toolbar size="md" inset>
          <span slot="left">md</span>
          <span slot="center">Medium</span>
          <span slot="right">End</span>
        </dui-toolbar>
        <dui-toolbar size="lg" inset>
          <span slot="left">lg</span>
          <span slot="center">Large</span>
          <span slot="right">End</span>
        </dui-toolbar>
        <dui-toolbar size="xl" inset>
          <span slot="left">xl</span>
          <span slot="center">Extra Large</span>
          <span slot="right">End</span>
        </dui-toolbar>
      </dui-docs-demo>

      <dui-docs-demo label="Left and right only">
        <dui-toolbar size="lg" inset has-button-right>
          <span slot="left">Navigation</span>
          <dui-button slot="right" appearance="outline" size="sm">Action</dui-button>
        </dui-toolbar>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
