import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-badge")
export class DocsPageBadge extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-badge">
        <dui-docs-demo label="Variants">
        <docs-row>
          <dui-badge>Default</dui-badge>
          <dui-badge variant="secondary">Secondary</dui-badge>
          <dui-badge variant="destructive">Destructive</dui-badge>
          <dui-badge variant="outline">Outline</dui-badge>
          <dui-badge variant="success">Success</dui-badge>
          <dui-badge variant="warning">Warning</dui-badge>
          <dui-badge variant="info">Info</dui-badge>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="With icons">
        <docs-row>
          <dui-badge variant="success"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>Fulfilled</dui-badge>
          <dui-badge variant="warning"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg></dui-icon>Unfulfilled</dui-badge>
          <dui-badge variant="info"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></dui-icon>Draft</dui-badge>
          <dui-badge variant="destructive"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon>Error</dui-badge>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Custom colors">
        <docs-row>
          <dui-badge variant="outline" style="--badge-fg: oklch(0.65 0.15 80); --badge-border: oklch(0.65 0.15 80)">Outline</dui-badge>
          <dui-badge style="--badge-bg: oklch(0.62 0.2 300); --badge-fg: white">Filled</dui-badge>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
