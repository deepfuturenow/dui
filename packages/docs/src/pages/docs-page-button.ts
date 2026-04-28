import { LitElement, html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { Upload, Settings, Search, X, Trash2 } from "lucide-static";
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
          <dui-button variant="primary"><dui-icon>${unsafeHTML(Upload)}</dui-icon> Upload</dui-button>
          <dui-button appearance="outline"><dui-icon>${unsafeHTML(Upload)}</dui-icon> Export</dui-button>
          <dui-button appearance="ghost"><dui-icon>${unsafeHTML(Settings)}</dui-icon> Settings</dui-button>
        </docs-row>
      </dui-docs-demo>

      <dui-docs-demo label="Icon Only">
        <docs-row>
          <dui-button appearance="ghost" aria-label="Settings" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon>${unsafeHTML(Settings)}</dui-icon></dui-button>
          <dui-button appearance="ghost" aria-label="Search" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon>${unsafeHTML(Search)}</dui-icon></dui-button>
          <dui-button appearance="outline" aria-label="Close" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon>${unsafeHTML(X)}</dui-icon></dui-button>
          <dui-button variant="danger" aria-label="Delete" style="--button-width: var(--button-height); --button-padding-x: 0; --button-padding-y: 0;"><dui-icon>${unsafeHTML(Trash2)}</dui-icon></dui-button>
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
