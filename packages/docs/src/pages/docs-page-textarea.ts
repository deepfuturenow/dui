import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-textarea")
export class DocsPageTextarea extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-textarea")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Default">
        <dui-textarea placeholder="Type something..."></dui-textarea>
      </dui-docs-demo>

      <dui-docs-demo label="With rows">
        <dui-textarea placeholder="5 rows visible" rows="5"></dui-textarea>
      </dui-docs-demo>

      <dui-docs-demo label="Auto-resize">
        <dui-textarea resize="auto" placeholder="Grows as you type..."></dui-textarea>
      </dui-docs-demo>

      <dui-docs-demo label="Auto-resize with max-height">
        <dui-textarea resize="auto" max-height="150px" placeholder="Grows up to 150px, then scrolls..."></dui-textarea>
      </dui-docs-demo>

      <dui-docs-demo label="Ghost variant">
        <dui-textarea variant="ghost" placeholder="No border or background..."></dui-textarea>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-textarea disabled value="Cannot edit this"></dui-textarea>
      </dui-docs-demo>

      <dui-docs-demo label="Read-only">
        <dui-textarea readonly value="Read-only content"></dui-textarea>
      </dui-docs-demo>

      <h2>API Reference</h2>
      ${renderApiTable(meta)}
    `;
  }
}
