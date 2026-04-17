import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { proseSheet } from "@dui/theme-default/prose";

@customElement("docs-page-tabs")
export class DocsPageTabs extends LitElement {
  protected override createRenderRoot() {
    return this;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    // Adopt prose styles on the root that contains this element (docs-app's shadow root)
    const root = this.getRootNode() as Document | ShadowRoot;
    if ('adoptedStyleSheets' in root && !root.adoptedStyleSheets.includes(proseSheet)) {
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, proseSheet];
    }
  }

  override render() {
    return html`
      <docs-page-layout
        tag="dui-tabs"
        .additionalTags=${[
          "dui-tabs-list",
          "dui-tab",
          "dui-tabs-panel",
          "dui-tabs-indicator",
        ]}
      >
        <dui-docs-demo label="Default" demo-width="20rem">
          <dui-tabs default-value="account">
            <dui-tabs-list>
              <dui-tab value="account">Account</dui-tab>
              <dui-tab value="password">Password</dui-tab>
              <dui-tab value="settings">Settings</dui-tab>
              <dui-tabs-indicator></dui-tabs-indicator>
            </dui-tabs-list>
            <dui-tabs-panel value="account" class="dui-prose">
              <div class="dui-prose">
                <h1>Account settings</h1>
                <p>Enim aliqua laboris et exercitation duis ex cupidatat. Dolor proident minim ad eiusmod velit ad proident reprehenderit. Sit consequat pariatur reprehenderit reprehenderit duis consectetur mollit aliqua officia nisi veniam irure ipsum. Aliqua elit minim voluptate culpa. Ad dolore laboris laborum amet. Enim ullamco anim nisi pariatur reprehenderit enim eu tempor pariatur laboris occaecat eu. Do adipisicing reprehenderit eiusmod irure ut aliquip quis irure voluptate id nisi ea tempor pariatur. Irure occaecat deserunt cupidatat laboris ex duis nostrud ullamco id Lorem laboris do..</p>
              </div>
            </dui-tabs-panel>
            <dui-tabs-panel value="password">
              <p>Password settings content goes here.</p>
            </dui-tabs-panel>
            <dui-tabs-panel value="settings">
              <p>General settings content goes here.</p>
            </dui-tabs-panel>
          </dui-tabs>
        </dui-docs-demo>

        <dui-docs-demo label="With disabled tab" demo-width="20rem">
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
