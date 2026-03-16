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
            <dui-icon icon="upload_file" style="--icon-size: var(--space-8); --icon-fg: var(--muted-foreground);"></dui-icon>
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
