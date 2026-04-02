import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-portal")
export class DocsPagePortal extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-portal">
        <dui-docs-demo label="Usage note">
        <p style="margin: 0; color: var(--muted-foreground);">
          Portal teleports its light DOM children to a target container elsewhere in the document.
          It is primarily used internally by overlay components (dialog, popover, tooltip) to
          render popups at the document root.
        </p>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
