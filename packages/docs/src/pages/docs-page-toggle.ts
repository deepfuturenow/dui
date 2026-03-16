import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { componentRegistry } from "../component-registry.ts";
import { renderApiTable, pageStyles } from "./page-utils.ts";

@customElement("docs-page-toggle")
export class DocsPageToggle extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    const meta = componentRegistry.find((c) => c.tagName === "dui-toggle")!;
    const groupMeta = componentRegistry.find((c) => c.tagName === "dui-toggle-group")!;

    return html`
      <style>${pageStyles}</style>
      <h1>${meta.name}</h1>
      <p class="description">${meta.description}</p>

      <dui-docs-demo label="Standalone">
        <div class="row">
          <dui-toggle aria-label="Toggle bold">
            <strong>B</strong>
          </dui-toggle>
          <dui-toggle aria-label="Toggle italic">
            <em>I</em>
          </dui-toggle>
        </div>
      </dui-docs-demo>

      <dui-docs-demo label="Default Pressed">
        <dui-toggle default-pressed aria-label="Toggle bold">
          <strong>B</strong>
        </dui-toggle>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <dui-toggle disabled aria-label="Toggle bold">
          <strong>B</strong>
        </dui-toggle>
      </dui-docs-demo>

      <dui-docs-demo label="Single Selection Group">
        <dui-toggle-group type="single">
          <dui-toggle value="left" aria-label="Align left">L</dui-toggle>
          <dui-toggle value="center" aria-label="Align center">C</dui-toggle>
          <dui-toggle value="right" aria-label="Align right">R</dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <dui-docs-demo label="Multiple Selection Group">
        <dui-toggle-group type="multiple">
          <dui-toggle value="bold" aria-label="Toggle bold"><strong>B</strong></dui-toggle>
          <dui-toggle value="italic" aria-label="Toggle italic"><em>I</em></dui-toggle>
          <dui-toggle value="underline" aria-label="Toggle underline"><u>U</u></dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <dui-docs-demo label="Vertical Group">
        <dui-toggle-group type="single" orientation="vertical">
          <dui-toggle value="top" aria-label="Top">Top</dui-toggle>
          <dui-toggle value="middle" aria-label="Middle">Mid</dui-toggle>
          <dui-toggle value="bottom" aria-label="Bottom">Bot</dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled Group">
        <dui-toggle-group type="single" disabled>
          <dui-toggle value="a">A</dui-toggle>
          <dui-toggle value="b">B</dui-toggle>
          <dui-toggle value="c">C</dui-toggle>
        </dui-toggle-group>
      </dui-docs-demo>

      <h2>API Reference</h2>
      <h3 style="font-size: var(--font-size-base); margin: var(--space-4) 0 var(--space-2);">Toggle</h3>
      ${renderApiTable(meta)}
      <h3 style="font-size: var(--font-size-base); margin: var(--space-4) 0 var(--space-2);">Toggle Group</h3>
      ${renderApiTable(groupMeta)}
    `;
  }
}
