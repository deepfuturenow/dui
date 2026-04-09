import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-toggle-group")
export class DocsPageToggleGroup extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-toggle-group">
        <dui-docs-demo label="Single Selection">
        <dui-toggle-group type="single">
          <dui-toggle value="left" aria-label="Align left">L</dui-toggle>
          <dui-toggle value="center" aria-label="Align center">C</dui-toggle>
          <dui-toggle value="right" aria-label="Align right">R</dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <dui-docs-demo label="Multiple Selection">
        <dui-toggle-group type="multiple">
          <dui-toggle value="bold" aria-label="Toggle bold"><strong>B</strong></dui-toggle>
          <dui-toggle value="italic" aria-label="Toggle italic"><em>I</em></dui-toggle>
          <dui-toggle value="underline" aria-label="Toggle underline"><u>U</u></dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <dui-docs-demo label="Vertical">
        <dui-toggle-group type="single" orientation="vertical">
          <dui-toggle value="top" aria-label="Top">Top</dui-toggle>
          <dui-toggle value="middle" aria-label="Middle">Mid</dui-toggle>
          <dui-toggle value="bottom" aria-label="Bottom">Bot</dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-toggle-group type="single" disabled>
          <dui-toggle value="a">A</dui-toggle>
          <dui-toggle value="b">B</dui-toggle>
          <dui-toggle value="c">C</dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
