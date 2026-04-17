import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-card-grid")
export class DocsPageCardGrid extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-card-grid">

        <dui-docs-demo label="3 columns (default)">
          <dui-card-grid>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 1</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 2</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 3</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 4</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 5</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 6</div>
          </dui-card-grid>
        </dui-docs-demo>

        <dui-docs-demo label="2 columns">
          <dui-card-grid columns="2">
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 1</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 2</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 3</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 4</div>
          </dui-card-grid>
        </dui-docs-demo>

        <dui-docs-demo label="4 columns">
          <dui-card-grid columns="4">
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 1</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 2</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 3</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 4</div>
          </dui-card-grid>
        </dui-docs-demo>

        <dui-docs-demo label="1 column">
          <dui-card-grid columns="1">
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 1</div>
            <div style="padding: var(--space-4); border: var(--border-width-thin) solid var(--border); border-radius: var(--radius-md); background: var(--surface-1);">Card 2</div>
          </dui-card-grid>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
