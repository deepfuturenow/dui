import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("docs-page-button")
export class DocsPageButton extends LitElement {
  protected override createRenderRoot() { return this; }

  override render() {

    return html`
      <docs-page-layout tag="dui-button">
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
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button>Neutral</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="primary">Primary</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="danger">Danger</dui-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Soft</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button appearance="soft">Neutral</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="primary" appearance="soft">Primary</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="danger" appearance="soft">Danger</dui-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Outline</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button appearance="outline">Neutral</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="primary" appearance="outline">Primary</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="danger" appearance="outline">Danger</dui-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Ghost</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button appearance="ghost">Neutral</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="primary" appearance="ghost">Primary</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="danger" appearance="ghost">Danger</dui-button></td>
            </tr>
            <tr>
              <td style="padding: var(--space-2) var(--space-4); color: var(--text-2); font-size: var(--text-xs);">Link</td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button appearance="link">Neutral</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="primary" appearance="link">Primary</dui-button></td>
              <td style="padding: var(--space-2) var(--space-4); text-align: center;"><dui-button variant="danger" appearance="link">Danger</dui-button></td>
            </tr>
          </tbody>
        </table>
      </dui-docs-demo>

      <dui-docs-demo label="Sizes">
        <docs-row>
          <dui-button size="xs" appearance="outline">Extra Small</dui-button>
          <dui-button size="sm" appearance="outline">Small</dui-button>
          <dui-button size="md" appearance="outline">Medium</dui-button>
          <dui-button size="lg" appearance="outline">Large</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="With Icon">
        <docs-row>
          <dui-button variant="primary"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></dui-icon> Upload</dui-button>
          <dui-button appearance="outline"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></dui-icon> Export</dui-button>
          <dui-button appearance="ghost"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></dui-icon> Settings</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Icon Only">
        <docs-row>
          <dui-button appearance="ghost" aria-label="Settings" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></dui-icon></dui-button>
          <dui-button appearance="ghost" aria-label="Search" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></dui-icon></dui-button>
          <dui-button appearance="outline" aria-label="Close" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></dui-icon></dui-button>
          <dui-button variant="danger" aria-label="Delete" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></dui-icon></dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="As Link (href)">
        <docs-row>
          <dui-button variant="primary" href="#/components/button">Get started</dui-button>
          <dui-button appearance="outline" href="#/components/button">Documentation</dui-button>
          <dui-button appearance="ghost" href="#/components/button">Learn more</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Inline Link">
        <p style="margin: 0; font-family: var(--font-sans); font-size: var(--text-sm); color: var(--text-2); line-height: var(--line-height-relaxed);">
          By signing up you agree to our
          <dui-button appearance="link" href="#/components/button">Terms of Service</dui-button>
          and
          <dui-button appearance="link" href="#/components/button">Privacy Policy</dui-button>.
        </p>
      </dui-docs-demo>

      <dui-docs-demo label="Disabled">
        <docs-row>
          <dui-button disabled>Disabled</dui-button>
          <dui-button disabled appearance="outline">Disabled</dui-button>
          <dui-button disabled appearance="ghost">Disabled</dui-button>
        </docs-row>
      </dui-docs-demo>
      </docs-page-layout>
    `;
  }
}
