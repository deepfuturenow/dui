import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-dropzone")
export class DocsPageDropzone extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-dropzone")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <dui-dropzone></dui-dropzone>
      </dui-docs-demo>

      <dui-docs-demo label="Custom content">
        <dui-dropzone accept="image/*" multiple>
          <dui-vstack gap="2">
            <dui-icon style="--icon-size: var(--space-8); --icon-color: var(--muted-foreground);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></dui-icon>
            <span>Drop images here or click to browse</span>
            <span style="font-size: var(--font-size-xs); color: var(--muted-foreground);">PNG, JPG, GIF up to 10MB</span>
          </dui-vstack>
        </dui-dropzone>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-dropzone disabled></dui-dropzone>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
