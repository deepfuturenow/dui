import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-tabs")
export class DocsPageTabs extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-tabs" .additionalTags=${["dui-tabs-list","dui-tab","dui-tabs-panel","dui-tabs-indicator"]}>
        <dui-docs-demo label="Default" demo-width="26rem">
        <dui-tabs default-value="account">
          <dui-tabs-list>
            <dui-tab value="account">Account</dui-tab>
            <dui-tab value="password">Password</dui-tab>
            <dui-tab value="settings">Settings</dui-tab>
            <dui-tabs-indicator></dui-tabs-indicator>
          </dui-tabs-list>
          <dui-tabs-panel value="account">
            Nisi veniam nisi cillum excepteur. Deserunt id aliquip fugiat amet adipisicing ipsum consectetur ad amet non ex officia reprehenderit ipsum. 
          </dui-tabs-panel>
          <dui-tabs-panel value="password">
            Ut aliqua culpa exercitation nostrud ipsum ea do sint veniam est. Incididunt in excepteur voluptate mollit amet elit culpa. Aute tempor ipsum aliqua fugiat.
          </dui-tabs-panel>
          <dui-tabs-panel value="settings">
            Ad nulla elit laborum officia veniam quis aute. Adipisicing aliquip consectetur exercitation labore veniam excepteur incididunt magna eiusmod. Enim irure ea in sint irure excepteur.
          </dui-tabs-panel>
        </dui-tabs>
      </dui-docs-demo>

      <dui-docs-demo label="With disabled tab" demo-width="26rem">
        <dui-tabs default-value="first">
          <dui-tabs-list>
            <dui-tab value="first">First</dui-tab>
            <dui-tab value="second" disabled>Second (disabled)</dui-tab>
            <dui-tab value="third">Third</dui-tab>
            <dui-tabs-indicator></dui-tabs-indicator>
          </dui-tabs-list>
          <dui-tabs-panel value="first">
            First panel content.
          </dui-tabs-panel>
          <dui-tabs-panel value="second">
            Second panel content.
          </dui-tabs-panel>
          <dui-tabs-panel value="third">
            Third panel content.
          </dui-tabs-panel>
        </dui-tabs>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
