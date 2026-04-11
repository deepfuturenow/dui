import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-dropzone")
export class DocsPageDropzone extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-dropzone">
        <dui-docs-demo label="Default">
        <dui-dropzone></dui-dropzone>
      </dui-docs-demo>

      <dui-docs-demo label="Custom content">
        <dui-dropzone accept="image/*" multiple>
          <div style="display: flex; flex-direction: column; gap: var(--space-2); align-items: center;">
            <dui-icon style="--icon-size: var(--space-8); --icon-color: var(--text-2);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></dui-icon>
            <span>Drop images here or click to browse</span>
            <span style="font-size: var(--font-size-xs); color: var(--text-2);">PNG, JPG, GIF up to 10MB</span>
          </div>
        </dui-dropzone>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-dropzone disabled></dui-dropzone>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
