import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-badge")
export class DocsPageBadge extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-badge">
        <dui-docs-demo label="Variants (intent)">
        <docs-row>
          <dui-badge>Neutral</dui-badge>
          <dui-badge variant="primary">Primary</dui-badge>
          <dui-badge variant="danger">Danger</dui-badge>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Variant × Appearance">
        <table style="border-collapse: collapse; font-family: var(--font-sans); font-size: var(--text-sm);">
          <thead>
            <tr>
              <th style="padding: var(--space-2) var(--space-4); text-align: left; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;"></th>
              <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;">Neutral</th>
              <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;">Primary</th>
              <th style="padding: var(--space-2) var(--space-4); text-align: center; color: var(--text-3); font-size: var(--text-xs); font-weight: 500;">Danger</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Filled</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge>Neutral</dui-badge></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="primary">Primary</dui-badge></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="danger">Danger</dui-badge></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Outline</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge appearance="outline">Neutral</dui-badge></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="primary" appearance="outline">Primary</dui-badge></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="danger" appearance="outline">Danger</dui-badge></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Soft</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge appearance="soft">Neutral</dui-badge></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="primary" appearance="soft">Primary</dui-badge></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-badge variant="danger" appearance="soft">Danger</dui-badge></td>
            </tr>
          </tbody>
        </table>
      </dui-docs-demo>

      <dui-docs-demo label="Icons & custom colors">
        <docs-row>
          <dui-badge appearance="soft" style="--badge-bg: oklch(0.4 0.5 155 / 0.13); --badge-fg: oklch(0.55 0.15 155)"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></dui-icon>Complete</dui-badge>
          <dui-badge variant="primary"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></dui-icon>Info</dui-badge>
          <dui-badge variant="danger"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon>Error</dui-badge>
          <dui-badge appearance="outline" style="--badge-fg: oklch(0.65 0.22 80); --badge-border: oklch(0.75 0.18 80)">Warning</dui-badge>
          <dui-badge style="--badge-bg: oklch(0.62 0.2 300); --badge-fg: white">Cupcake</dui-badge>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
