import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-tabs")
export class DocsPageTabs extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-tabs")!;
    const listMeta = componentRegistry.find((c) => c.tagName === "dui-tabs-list")!;
    const tabMeta = componentRegistry.find((c) => c.tagName === "dui-tab")!;
    const panelMeta = componentRegistry.find((c) => c.tagName === "dui-tabs-panel")!;
    const indicatorMeta = componentRegistry.find((c) => c.tagName === "dui-tabs-indicator")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

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

      <h2>API Reference — Tabs</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Tabs List</h2>
      ${renderApiTable(listMeta)}

      <h2>API Reference — Tab</h2>
      ${renderApiTable(tabMeta)}

      <h2>API Reference — Tabs Panel</h2>
      ${renderApiTable(panelMeta)}

      <h2>API Reference — Tabs Indicator</h2>
      ${renderApiTable(indicatorMeta)}
    `;
  }
}
