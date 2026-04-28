import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { CircleUser } from "lucide-static";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-avatar")
export class DocsPageAvatar extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-avatar">
        <dui-docs-demo label="With fallback initials">
        <docs-row>
          <dui-avatar>JC</dui-avatar>
          <dui-avatar>AB</dui-avatar>
          <dui-avatar>ZK</dui-avatar>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <div class="row" style="align-items: center;">
          <dui-avatar size="var(--space-8)">S</dui-avatar>
          <dui-avatar>M</dui-avatar>
          <dui-avatar size="var(--space-16)">L</dui-avatar>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="With icon fallback">
        <dui-avatar>
          <dui-icon>${unsafeHTML(CircleUser)}</dui-icon>
        </dui-avatar>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
