import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-breadcrumb")
export class DocsPageBreadcrumb extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-breadcrumb")!;
    const itemMeta = componentRegistry.find((c) => c.tagName === "dui-breadcrumb-item")!;
    const linkMeta = componentRegistry.find((c) => c.tagName === "dui-breadcrumb-link")!;
    const pageMeta = componentRegistry.find((c) => c.tagName === "dui-breadcrumb-page")!;
    const separatorMeta = componentRegistry.find((c) => c.tagName === "dui-breadcrumb-separator")!;
    const ellipsisMeta = componentRegistry.find((c) => c.tagName === "dui-breadcrumb-ellipsis")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Basic">
        <dui-breadcrumb>
          <dui-breadcrumb-item>
            <dui-breadcrumb-link><a href="#/components/breadcrumb">Home</a></dui-breadcrumb-link>
          </dui-breadcrumb-item>
          <dui-breadcrumb-separator></dui-breadcrumb-separator>
          <dui-breadcrumb-item>
            <dui-breadcrumb-link><a href="#/components/breadcrumb">Components</a></dui-breadcrumb-link>
          </dui-breadcrumb-item>
          <dui-breadcrumb-separator></dui-breadcrumb-separator>
          <dui-breadcrumb-item>
            <dui-breadcrumb-page>Breadcrumb</dui-breadcrumb-page>
          </dui-breadcrumb-item>
        </dui-breadcrumb>
      </dui-docs-demo>

      <dui-docs-demo label="With ellipsis">
        <dui-breadcrumb>
          <dui-breadcrumb-item>
            <dui-breadcrumb-link><a href="#/components/breadcrumb">Home</a></dui-breadcrumb-link>
          </dui-breadcrumb-item>
          <dui-breadcrumb-separator></dui-breadcrumb-separator>
          <dui-breadcrumb-item>
            <dui-breadcrumb-ellipsis></dui-breadcrumb-ellipsis>
          </dui-breadcrumb-item>
          <dui-breadcrumb-separator></dui-breadcrumb-separator>
          <dui-breadcrumb-item>
            <dui-breadcrumb-link><a href="#/components/breadcrumb">Components</a></dui-breadcrumb-link>
          </dui-breadcrumb-item>
          <dui-breadcrumb-separator></dui-breadcrumb-separator>
          <dui-breadcrumb-item>
            <dui-breadcrumb-page>Breadcrumb</dui-breadcrumb-page>
          </dui-breadcrumb-item>
        </dui-breadcrumb>
      </dui-docs-demo>

      <h2>API Reference — Breadcrumb</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Breadcrumb Item</h2>
      ${renderApiTable(itemMeta)}

      <h2>API Reference — Breadcrumb Link</h2>
      ${renderApiTable(linkMeta)}

      <h2>API Reference — Breadcrumb Page</h2>
      ${renderApiTable(pageMeta)}

      <h2>API Reference — Breadcrumb Separator</h2>
      ${renderApiTable(separatorMeta)}

      <h2>API Reference — Breadcrumb Ellipsis</h2>
      ${renderApiTable(ellipsisMeta)}
    `;
  }
}
