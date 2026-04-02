import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-trunc")
export class DocsPageTrunc extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-trunc">
        <dui-docs-demo label="Single-line truncation (default)">
        <dui-trunc>This is a long piece of text that will be truncated with an ellipsis when it exceeds the default max-width of 20rem.</dui-trunc>
      </dui-docs-demo>

      <dui-docs-demo label="Custom max-width">
        <dui-trunc max-width="10rem">Shorter truncation width applied here.</dui-trunc>
      </dui-docs-demo>

      <dui-docs-demo label="Multi-line clamping (max-lines=2)">
        <dui-trunc max-lines="2" max-width="100%">
          This text will be clamped to two visible lines. Any overflow beyond the second line
          will be truncated with an ellipsis. This is useful for card descriptions, previews,
          or any content that needs to be kept compact while still showing a meaningful amount of text.
        </dui-trunc>
      </dui-docs-demo>

      <dui-docs-demo label="Multi-line clamping (max-lines=3)">
        <dui-trunc max-lines="3" max-width="100%">
          This text will be clamped to three visible lines. Any overflow beyond the third line
          will be truncated with an ellipsis. This is useful for card descriptions, previews,
          or any content that needs to be kept compact while still showing a meaningful amount of text.
          Adding more text here to ensure we actually exceed three lines and see the truncation in action.
        </dui-trunc>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
