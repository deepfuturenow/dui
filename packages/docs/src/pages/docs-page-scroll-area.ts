import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-scroll-area")
export class DocsPageScrollArea extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-scroll-area">
        <dui-docs-demo label="Vertical scroll" demo-width="30rem">
        <dui-scroll-area max-height="150px" style="border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div style="font-size: var(--text-sm); line-height: var(--text-sm--line-height); padding: var(--space-4)">
            <p style="margin: 0 0 var(--space-3)">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p style="margin: 0">Exercitation sunt deserunt occaecat Lorem Lorem mollit minim. Proident quis qui mollit eu culpa excepteur sit. Tempor proident excepteur aliquip aute Lorem laborum. Tempor sit ipsum incididunt velit. Consequat quis est fugiat nisi non. Anim proident ut consectetur est. Dolor esse deserunt laborum reprehenderit nostrud elit ea reprehenderit fugiat ullamco nisi mollit. Non commodo laboris magna id mollit voluptate amet id excepteur ipsum sint aute. Irure ad amet amet sunt. Est irure deserunt incididunt.</p>
          </div>
        </dui-scroll-area>
      </dui-docs-demo>

      <dui-docs-demo label="With fade" demo-width="30rem">
        <dui-scroll-area max-height="150px" fade style="border: 1px solid var(--border); border-radius: var(--radius-md);">
          <div style="font-size: var(--text-sm); line-height: var(--text-sm--line-height); padding: var(--space-4)">
            <p style="margin: 0 0 var(--space-3)">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            <p style="margin: 0">Exercitation sunt deserunt occaecat Lorem Lorem mollit minim. Proident quis qui mollit eu culpa excepteur sit. Tempor proident excepteur aliquip aute Lorem laborum. Tempor sit ipsum incididunt velit. Consequat quis est fugiat nisi non. Anim proident ut consectetur est. Dolor esse deserunt laborum reprehenderit nostrud elit ea reprehenderit fugiat ullamco nisi mollit. Non commodo laboris magna id mollit voluptate amet id excepteur ipsum sint aute. Irure ad amet amet sunt. Est irure deserunt incididunt.</p>
          </div>
        </dui-scroll-area>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
