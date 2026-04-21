import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-badge")
export class DocsPageBadge extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {
    return html`
      <docs-page-layout tag="dui-badge">

        <dui-docs-demo label="Variants">
          <docs-row>
            <dui-badge>Neutral</dui-badge>
            <dui-badge variant="primary">Primary</dui-badge>
            <dui-badge variant="danger">Danger</dui-badge>
          </docs-row>
        </dui-docs-demo>

        <dui-docs-demo label="Variant × Appearance">
          <table style="border-collapse: collapse; font-family: var(--font-sans); font-size: var(--font-size-sm);">
            <thead>
              <tr>
                <th style="padding: var(--space-2) var(--space-4); text-align: left; color: var(--text-3); font-size: var(--font-size-xs); font-weight: 500;"></th>
                <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--font-size-xs); font-weight: 500;">Neutral</th>
                <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--font-size-xs); font-weight: 500;">Primary</th>
                <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--font-size-xs); font-weight: 500;">Danger</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--font-size-xs);">Filled</td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge>Badge</dui-badge></td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="primary">Badge</dui-badge></td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="danger">Badge</dui-badge></td>
              </tr>
              <tr>
                <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--font-size-xs);">Outline</td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge appearance="outline">Badge</dui-badge></td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="primary" appearance="outline">Badge</dui-badge></td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="danger" appearance="outline">Badge</dui-badge></td>
              </tr>
              <tr>
                <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--font-size-xs);">Ghost</td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge appearance="ghost">Badge</dui-badge></td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="primary" appearance="ghost">Badge</dui-badge></td>
                <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="danger" appearance="ghost">Badge</dui-badge></td>
              </tr>
            </tbody>
          </table>
        </dui-docs-demo>

        <dui-docs-demo label="With icons">
          <docs-row>
            <dui-badge variant="primary"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>Approved</dui-badge>
            <dui-badge variant="danger"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon>Rejected</dui-badge>
            <dui-badge appearance="ghost"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></dui-icon>Draft</dui-badge>
          </docs-row>
        </dui-docs-demo>

        <dui-docs-demo label="Custom colors">
          <docs-row>
            <dui-badge appearance="outline" style="--badge-fg: oklch(0.65 0.15 80); --badge-border: oklch(0.65 0.15 80)">Outline</dui-badge>
            <dui-badge style="--badge-bg: oklch(0.62 0.2 300); --badge-fg: white">Filled</dui-badge>
          </docs-row>
        </dui-docs-demo>

      </docs-page-layout>
    `;
  }
}
