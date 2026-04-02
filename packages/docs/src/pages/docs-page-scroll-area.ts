import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-scroll-area")
export class DocsPageScrollArea extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-scroll-area">
        <dui-docs-demo label="Vertical scroll">
        <dui-scroll-area max-height="150px" style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-2);">
          <div style="font-size: var(--font-size-sm); line-height: var(--line-height-relaxed);">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.</p>
          </div>
        </dui-scroll-area>
      </dui-docs-demo>

      <dui-docs-demo label="With fade">
        <dui-scroll-area max-height="150px" fade style="border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-2);">
          <div style="font-size: var(--font-size-sm); line-height: var(--line-height-relaxed);">
            <p>Scroll down to see the fade effect at the top.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.</p>
            <p>Excepteur sint occaecat cupidatat non proident.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
          </div>
        </dui-scroll-area>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
