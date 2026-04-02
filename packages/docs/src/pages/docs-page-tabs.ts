import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-tabs")
export class DocsPageTabs extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-tabs" .additionalTags=${["dui-tabs-list","dui-tab","dui-tabs-panel","dui-tabs-indicator"]}>
        <dui-docs-demo label="Default">
        <dui-tabs default-value="account">
          <dui-tabs-list>
            <dui-tab value="account">Account</dui-tab>
            <dui-tab value="password">Password</dui-tab>
            <dui-tab value="settings">Settings</dui-tab>
            <dui-tabs-indicator></dui-tabs-indicator>
          </dui-tabs-list>
          <dui-tabs-panel value="account">
            <p>Account settings content goes here.</p>
          </dui-tabs-panel>
          <dui-tabs-panel value="password">
            <p>Password settings content goes here.</p>
          </dui-tabs-panel>
          <dui-tabs-panel value="settings">
            <p>General settings content goes here.</p>
          </dui-tabs-panel>
        </dui-tabs>
      </dui-docs-demo>

      <dui-docs-demo label="With disabled tab">
        <dui-tabs default-value="first">
          <dui-tabs-list>
            <dui-tab value="first">First</dui-tab>
            <dui-tab value="second" disabled>Second (disabled)</dui-tab>
            <dui-tab value="third">Third</dui-tab>
            <dui-tabs-indicator></dui-tabs-indicator>
          </dui-tabs-list>
          <dui-tabs-panel value="first">
            <p>First panel content.</p>
          </dui-tabs-panel>
          <dui-tabs-panel value="second">
            <p>Second panel content.</p>
          </dui-tabs-panel>
          <dui-tabs-panel value="third">
            <p>Third panel content.</p>
          </dui-tabs-panel>
        </dui-tabs>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
