import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-breadcrumb")
export class DocsPageBreadcrumb extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-breadcrumb" .additionalTags=${["dui-breadcrumb-item","dui-breadcrumb-link","dui-breadcrumb-page","dui-breadcrumb-separator","dui-breadcrumb-ellipsis"]}>
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
      </docs-page-layout>
    `;
  }
}
