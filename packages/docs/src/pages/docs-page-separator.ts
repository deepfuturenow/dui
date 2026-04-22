import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-separator")
export class DocsPageSeparator extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-separator">
        <dui-docs-demo label="Horizontal">
          <div>
            <p style="text-box: trim-both cap alphabetic; margin: 0; font-size: var(--text-sm);">Content above</p>
            <dui-separator style="--separator-margin: var(--space-4)"></dui-separator>
            <p style="text-box: trim-both cap alphabetic; margin: 0; font-size: var(--text-sm);">Content below</p>
          </div>
        </dui-docs-demo>

        <dui-docs-demo label="Vertical">
          <div style="display: flex; align-items: center; gap: var(--space-2); height: var(--space-6);">
            <span>Left</span>
            <dui-separator orientation="vertical" style="--separator-margin: var(--space-1)"></dui-separator>
            <span>Center</span>
            <dui-separator orientation="vertical" style="--separator-margin: var(--space-1)"></dui-separator>
            <span>Right</span>
          </div>
        </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
