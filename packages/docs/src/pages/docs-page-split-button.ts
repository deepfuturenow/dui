import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-split-button")
export class DocsPageSplitButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-split-button">
        <dui-docs-demo label="Basic">
        <dui-split-button
          variant="primary"
          @dui-action=${() => console.log("Save clicked")}
        >
          Save
          <dui-menu-item slot="menu" @click=${() => console.log("Save As")}>Save As…</dui-menu-item>
          <dui-menu-item slot="menu" @click=${() => console.log("Save Draft")}>Save Draft</dui-menu-item>
          <dui-menu-item slot="menu" @click=${() => console.log("Save Template")}>Save as Template</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="Variants (intent)">
        <docs-row>
          <dui-split-button>
            Neutral
            <dui-menu-item slot="menu">Option A</dui-menu-item>
            <dui-menu-item slot="menu">Option B</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary">
            Primary
            <dui-menu-item slot="menu">Option A</dui-menu-item>
            <dui-menu-item slot="menu">Option B</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="danger">
            Danger
            <dui-menu-item slot="menu">Option A</dui-menu-item>
            <dui-menu-item slot="menu">Option B</dui-menu-item>
          </dui-split-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Appearances (treatment)">
        <docs-row>
          <dui-split-button variant="primary">
            Filled
            <dui-menu-item slot="menu">Option A</dui-menu-item>
            <dui-menu-item slot="menu">Option B</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary" appearance="outline">
            Outline
            <dui-menu-item slot="menu">Option A</dui-menu-item>
            <dui-menu-item slot="menu">Option B</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary" appearance="ghost">
            Ghost
            <dui-menu-item slot="menu">Option A</dui-menu-item>
            <dui-menu-item slot="menu">Option B</dui-menu-item>
          </dui-split-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <docs-row>
          <dui-split-button variant="primary" size="xs">
            X-Small
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary" size="sm">
            Small
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary">
            Medium
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>

          <dui-split-button variant="primary" size="lg">
            Large
            <dui-menu-item slot="menu">Option A</dui-menu-item>
          </dui-split-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="With icon">
        <dui-split-button variant="primary">
          <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15"/><path d="M18 18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><path d="M14 17v-4a2 2 0 0 0-2-2H8"/></svg></dui-icon>
          Save
          <dui-menu-item slot="menu">Save As…</dui-menu-item>
          <dui-menu-item slot="menu">Save Draft</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="Icon Only">
        <docs-row>
          <dui-split-button variant="primary" style="--sb-action-padding-x: var(--sb-trigger-padding-x); --sb-action-padding-y: 0;">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15"/><path d="M18 18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><path d="M14 17v-4a2 2 0 0 0-2-2H8"/></svg></dui-icon>
            <dui-menu-item slot="menu">Save As…</dui-menu-item>
            <dui-menu-item slot="menu">Save Draft</dui-menu-item>
          </dui-split-button>

          <dui-split-button appearance="outline" style="--sb-action-padding-x: var(--sb-trigger-padding-x); --sb-action-padding-y: 0;">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></dui-icon>
            <dui-menu-item slot="menu">Upload File</dui-menu-item>
            <dui-menu-item slot="menu">Upload Folder</dui-menu-item>
          </dui-split-button>

          <dui-split-button appearance="ghost" style="--sb-action-padding-x: var(--sb-trigger-padding-x); --sb-action-padding-y: 0;">
            <dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></dui-icon>
            <dui-menu-item slot="menu">Edit</dui-menu-item>
            <dui-menu-item slot="menu">Duplicate</dui-menu-item>
            <dui-menu-item slot="menu" variant="danger">Delete</dui-menu-item>
          </dui-split-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-split-button variant="primary" disabled>
          Save
          <dui-menu-item slot="menu">Save As…</dui-menu-item>
          <dui-menu-item slot="menu">Save Draft</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>

      <dui-docs-demo label="With disabled menu items">
        <dui-split-button variant="primary">
          Publish
          <dui-menu-item slot="menu">Publish Now</dui-menu-item>
          <dui-menu-item slot="menu" disabled>Schedule (unavailable)</dui-menu-item>
          <dui-menu-item slot="menu" variant="danger">Unpublish</dui-menu-item>
        </dui-split-button>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
