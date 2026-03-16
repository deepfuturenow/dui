import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-preview-card")
export class DocsPagePreviewCard extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-preview-card")!;
    const triggerMeta = componentRegistry.find((c) => c.tagName === "dui-preview-card-trigger")!;
    const popupMeta = componentRegistry.find((c) => c.tagName === "dui-preview-card-popup")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <dui-preview-card>
          <dui-preview-card-trigger>
            <a href="#" style="color: var(--primary); text-decoration: underline;">Hover me for a preview</a>
          </dui-preview-card-trigger>
          <dui-preview-card-popup>
            <dui-vstack gap="2">
              <strong>Preview Card</strong>
              <span style="color: var(--muted-foreground); font-size: var(--font-size-sm);">
                This is a rich content preview that stays open when you hover over it.
                Unlike a tooltip, the user can interact with the content.
              </span>
            </dui-vstack>
          </dui-preview-card-popup>
        </dui-preview-card>
      </dui-docs-demo>

      <dui-docs-demo label="Bottom placement">
        <dui-preview-card side="bottom">
          <dui-preview-card-trigger>
            <a href="#" style="color: var(--primary); text-decoration: underline;">Preview below</a>
          </dui-preview-card-trigger>
          <dui-preview-card-popup>
            <dui-vstack gap="2">
              <strong>Bottom Preview</strong>
              <span style="color: var(--muted-foreground); font-size: var(--font-size-sm);">
                This preview card appears below the trigger.
              </span>
            </dui-vstack>
          </dui-preview-card-popup>
        </dui-preview-card>
      </dui-docs-demo>

      <dui-docs-demo label="No arrow">
        <dui-preview-card>
          <dui-preview-card-trigger>
            <a href="#" style="color: var(--primary); text-decoration: underline;">No arrow</a>
          </dui-preview-card-trigger>
          <dui-preview-card-popup show-arrow="false">
            <span>Preview without an arrow indicator.</span>
          </dui-preview-card-popup>
        </dui-preview-card>
      </dui-docs-demo>

      <h2>API Reference — Preview Card</h2>
      ${renderApiTable(meta)}

      <h2>API Reference — Trigger</h2>
      ${renderApiTable(triggerMeta)}

      <h2>API Reference — Popup</h2>
      ${renderApiTable(popupMeta)}
    `;
  }
}
